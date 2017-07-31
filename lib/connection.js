var m_parent = Symbol('parent');
var m_connection = Symbol('connection');
var m_sql = Symbol('sql');
var m_base = Symbol('base');
var m_connectionRegex = /^([^:]+):\/\/(?:([^:]+):([^@\/]+)@?)?(?:([^\/:]+)(?::(\d+))?)?\/([^\?]+)(?:\?(.*))?$/;
var m_preparedSql = Symbol('preparedSql');

/**
 * Maps the connection components into a constrained object. Adds the
 * parseParameters helper function
 * 
 * @class ConnectionObject
 */
class ConnectionObject {
    /**
     * Creates an instance of ConnectionObject.
     * @param {string} driver 
     * @param {string} username 
     * @param {string} password 
     * @param {string} hostname 
     * @param {string} port 
     * @param {string} database 
     * @param {string} parameters 
     * @memberof ConnectionObject
     */
    constructor(driver, username, password, hostname, port, database, parameters) {
        this.Driver = require(driver);
        this.Username = username;
        this.Password = password;
        this.Hostname = hostname;
        this.Port = port;
        this.Database = database;
        this.Parameters = parameters;
    }

    /**
     * Splits the parameter string into an object of key/value pairs
     * 
     * @returns {any}
     * @memberof ConnectionObject
     */
    parseParameters() {
        var results = {};
        var params = this.Parameters.split(/&/g);
        params.map((p) => {
            let parts = p.split('=');
            results[parts[0]] = parts[1];
        });

        return results;
    }
}

class SqlObject {
    constructor(chunks, indexes) {
        this.sql = chunks.join("'");
        this.indexes = indexes;
    }

    /**
     * 
     * 
     * @param {array} args 
     * @returns {string} Prepared SQL statement
     * @memberof SqlObject
     */
    map(args) {
        if (this.indexes.length !== args.length) {
            throw new Error("Number of parameters does not match required parameters");
        }

        let sql = this.sql;
        let offset = 0;
        args.map((o, n) => {
            o = QuoteString(o);
            sql = sql.substr(0, this.indexes[n] + offset) + o + sql.substr(this.indexes[n] + offset + 1);
            offset += o.length - 1;
        });

        return sql;
    }
}

/**
 * Parses a connection string to extract the driver name,
 * username, password, hostname, port, database, and 
 * parameter string.
 * 
 * @param {string} connectionString 
 * @returns {ConnectionObject}
 */
function ParseConnection(connectionString) {
    [match, driver, username, password, hostname, port, database, parameters] = m_connectionRegex.exec(connectionString);
    return new ConnectionObject(driver, username, password, hostname, port, database, parameters);
}

/**
 * Quotes a string for SQL statements
 * 
 * @param {string|number} string 
 * @returns {string} the quoted string, or the passed parameter if it is a finite number
 */
function QuoteString(string) {
    if (typeof string === 'number') {
        if (Number.isFinite(string) === false) {
            return QuoteString(string.toString());
        }
        return string.toString();
    }
    string = string.toString();
    string = string.replace(/\\/g, '\\\\');
    string = string.replace('\x00', '\\x00');
    string = string.replace('\n', '\\n');
    string = string.replace('\r', '\\r');
    string = string.replace("'", "''");
    return "'" + string + "'";
}

/**
 * Prepares an SQL statement for use. Parses it into chunks of quoted
 * strings and non-quoted strings. Maps all the ?'s for future use.
 * 
 * @param {string} sql 
 * @returns {SqlObject}
 */
function Prepare(sql) {
    // break the sql into chunks of quoted and none quoted
    // every odd indexed element is quoted
    let chunks = sql.split("'");
    let indexes = [];
    let pos = 0;

    if (chunks.length % 2 === 0) {
        // if there's an even number of chunks, then the quotes aren't balanced
        throw new Error("Unbalanced quotes");
    }

    chunks.map((chunk, n) => {
        if (n % 2 === 1) {
            pos += chunk.length + 2;
            return;
        }
        let subPos = -1;
        while ((subPos = chunk.indexOf("?", subPos + 1)) >= 0) {
            indexes.push(pos + subPos);
        }
        pos += chunk.length;
    });

    return new SqlObject(chunks, indexes);
}

function Join(preparedSql, args) {
    if (preparedSql.indexes.length !== args.length) {
        throw new Error("Number of parameters does not match required parameters");
    }

    let sql = preparedSql.sql;
    let offset = 0;
    args.map((o, n) => {
        o = QuoteString(o);
        sql = sql.substr(0, preparedSql.indexes[n] + offset) + o + sql.substr(preparedSql.indexes[n] + offset + 1);
        offset += o.length - 1;
    });

    return sql;
}

class Statement {
    constructor(connection, sql) {
        this[m_parent] = connection;
        this[m_sql] = sql;

        if ((sql === undefined) || (sql === null)) {
            throw new Error("sql is not set");
        }
    }

    /**
     * @readonly
     * @returns {Connection}
     * @memberof Statement
     */
    get parent() {
        return this[m_parent];
    }

    /**
     * @readonly
     * @returns {SqlObject}
     * @memberof Statement
     */
    get preparedSql() {
        return this[m_preparedSql];
    }

    /**
     * @readonly
     * @returns {string}
     * @memberof Statement
     */
    get sql() {
        return this[m_sql];
    }

    /**
     * Executes the SQL query. If any parameters are required, they
     * will be passed to the query here.
     * 
     * @param {any} args 
     * @returns {Promise<array>}
     * @memberof Statement
     */
    query(... args) {
        return new Promise((resolve, reject) => {
            let sqlString;

            if (this.preparedSql !== null) {
                sqlString = this.preparedSql.map(args);
            } else {
                sqlString = this.sql;
            }

            this.parent[m_connection].query(sqlString)
            .then((response) => {
                resolve(response);
            })
            .catch((reason) => {
                reject(reason);
            });
        });
    }

    /**
     * Prepares the statement for use with parameters.
     * 
     * @memberof Statement
     */
    prepare() {
        this[m_preparedSql] = Prepare(this.sql);
    }

    /**
     * Executes the SQL statement. If any parameters are required, they
     * will be passed in here.
     * 
     * @param {any} args 
     * @returns {Promise<any>}
     * @memberof Statement
     */
    execute(... args) {
        var self = this;
        return new Promise((resolve, reject) => {
            let sqlString;
            
            if (this.preparedSql !== null) {
                sqlString = this.preparedSql.map(args);
            } else {
                sqlString = this.sql;
            }
            this.parent[m_connection].execute(sqlString)
            .then((result) => {
                resolve(result);
            })
            .catch((reason) => {
                reject(reason);
            });
        });
    }
}

class PreparedStatement extends Statement {
    constructor(connection, sql) {
        super(connection, sql);
        this.prepare();
    }
}

class Connection {
    constructor(connectionString) {
        this[m_base] = ParseConnection(connectionString);
        this[m_connection] = this[m_base].Driver.open(this[m_base]);
    }

    /**
     * @readonly
     * @returns {object}
     * @memberof Connection
     */
    get base() {
        return this[m_base];
    }

    /**
     * @readonly
     * @returns {object}
     * @memberof Connection
     */
    get connection() {
        return this[m_connection];
    }

    /**
     * Creates a statement with the passed SQL.
     * 
     * @param {string} sql 
     * @returns {Statement}
     * @memberof Connection
     */
    createStatement(sql) {
        let statement = new Statement(this, sql);
        return statement;
    }

    /**
     * Creates and prepares a statement with the passed SQL.
     * 
     * @param {string} sql 
     * @returns {PreparedStatement}
     * @memberof Connection
     */
    prepareStatement(sql) {
        let statement = new PreparedStatement(this, sql);
        return statement;
    }

    /**
     * Closes the underlying connection.
     * 
     * @returns {Promise<void>}
     * @memberof Connection
     */
    close() {
        return new Promise((resolve, reject) => {
            this.connection.close().then(() => {
                resolve();
            }).catch((reason) => {
                reject(reason);
            });
        });
    }
}

module.exports = Connection;