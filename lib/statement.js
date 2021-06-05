var SqlObject = require('./sqlObject');
var Prepare = require('./prepare');

var m_parent = Symbol('parent');
var m_sql = Symbol('sql');
var m_preparedSql = Symbol('preparedSql');

class Statement {
    constructor(connection, sql) {
        this[m_parent] = connection;
        this[m_sql] = sql;
        if (! sql) {
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
     * Executes the SQL query with the given arguments.
     *
     * @param {any} args
     * @returns {Promise<array>}
     * @memberof Statement
     */
    query(... args) {
        return new Promise((resolve, reject) => {
            let sqlString;
            if (this.preparedSql) {
                sqlString = this.preparedSql.map(args);
            } else {
                sqlString = this.sql;
            }
            this.parent.__connection.query(sqlString)
                .then(response => resolve(response))
                .catch(reason => reject(reason));
        });
    }

    /**
     * Prepares the statement for use with arguments.
     *
     * @memberof Statement
     */
    prepare() {
        this[m_preparedSql] = Prepare(this.sql);
    }

    /**
     * Executes the SQL statement with the given arguments.
     *
     * @param {any} args
     * @returns {Promise<any>}
     * @memberof Statement
     */
    execute(... args) {
        return new Promise((resolve, reject) => {
            let sqlString;
            if (this.preparedSql) {
                sqlString = this.preparedSql.map(args);
            } else {
                sqlString = this.sql;
            }
            this.parent.__connection.execute(sqlString)
                .then(result => resolve(result))
                .catch(reason => reject(reason));
        });
    }
}

module.exports = Statement;