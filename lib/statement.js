var SqlObject = require('./sqlObject');
var QuoteString = require('./quoteString');
var Prepare = require('./prepare');
var Join = require('./join');

var m_parent = Symbol('parent');
var m_sql = Symbol('sql');
var m_preparedSql = Symbol('preparedSql');


class Statement {
    constructor(connection, sql) {
        this[m_parent] = connection;
        this[m_sql] = sql;

        if ((sql === undefined) || (sql === null)) {
            throw new Error("sql is not set");
        }
    }

    /**
     * @private
     * @readonly
     * @returns {Connection}
     * @memberof Statement
     */
    get parent() {
        return this[m_parent];
    }

    /**
     * @private
     * @readonly
     * @returns {SqlObject}
     * @memberof Statement
     */
    get preparedSql() {
        return this[m_preparedSql];
    }

    /**
     * @private
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

            this.parent.__connection.query(sqlString)
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
            this.parent.__connection.execute(sqlString)
            .then((result) => {
                resolve(result);
            })
            .catch((reason) => {
                reject(reason);
            });
        });
    }
}

module.exports = Statement;