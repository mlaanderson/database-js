var m_parent = Symbol('parent');
var m_connection = Symbol('connection');
var m_sql = Symbol('sql');
var m_base = Symbol('base');
var m_connectionRegex = /^([^:]+):\/\/(?:([^:]+):([^@\/]+)@?)?(?:([^\/:]+)(?::(\d+))?)?\/([^\?]+)(?:\?(.*))?$/;
var m_preparedSql = Symbol('preparedSql');

function ParseConnection(connectionString) {
    [match, driver, username, password, hostname, port, database, parameters] = m_connectionRegex.exec(connectionString);
    return {
        Driver: require(driver),
        Username: username,
        Password: password,
        Hostname: hostname,
        Port: port,
        Database: database,
        Parameters: parameters
    }
}

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
    return `'${string}'`;
}

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

    return {
        sql: chunks.join("'"),
        indexes: indexes
    }
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

    async query(... args) {
        let sqlString, response;
        
        if (this[m_preparedSql] !== null) {
            sqlString = Join(this[m_preparedSql], args);
        } else {
            sqlString = this[m_sql];
        }
        
        try {
            response = await this[m_parent][m_connection].query(sqlString);
        } catch (error) {
            throw(error);
        }

        return response;
    }

    prepare() {
        this[m_preparedSql] = Prepare(this[m_sql]);
    }

    async execute(... args) {
        let sqlString, result;
        
        if (this[m_preparedSql] !== null) {
            sqlString = Join(this[m_preparedSql], args);
        } else {
            sqlString = this[m_sql];
        }

        result = await this[m_parent][m_connection].execute(sqlString);
        return result;
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

    createStatement(sql) {
        let statement = new Statement(this, sql);
        return statement;
    }

    prepareStatement(sql) {
        let statement = new PreparedStatement(this, sql);
        return statement;
    }

    async close() {
        await this[m_connection].close();
    }
}

Connection.Join = Join;
Connection.QuoteString = QuoteString;
Connection.Prepare = Prepare;

module.exports = Connection;