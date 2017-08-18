var ConnectionObject = require('./connectionObject');
var SqlObject = require('./sqlObject');
var QuoteString = require('./quoteString');
var ParseConnection = require('./parseConnection');
var Prepare = require('./prepare');
var Join = require('./join');
var Statement = require('./statement');
var PreparedStatement = require('./preparedStatement');


class Connection {
    constructor(connectionString, driver) {
        this.__base = ParseConnection(connectionString, driver);
        this.__connection = this.__base.Driver.open(this.__base);
        this.__connectionUrl = connectionString;
        this.__driver = driver || this.__base.Driver;
    }

    /**
     * @readonly
     * @returns {string}
     * @memberof Connection
     */
    get URL() {
        return this.__connectionUrl;
    }

    /**
     * @readonly
     * @returns {object}
     * @memberof Connection
     */
    get Driver() {
        return this.__driver;
    }

    /**
     * @readonly
     * @returns {object}
     * @memberof Connection
     */
    get base() {
        return this.__base;
    }

    /**
     * @readonly
     * @returns {object}
     * @memberof Connection
     */
    get connection() {
        return this.__connection;
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
     * @returns {Promise<boolean>}
     * @memberof Connection
     */
    close() {
        return new Promise((resolve, reject) => {
            this.connection.close().then(() => {
                resolve(true);
            }).catch((reason) => {
                reject(reason);
            });
        });
    }
}

module.exports = Connection;