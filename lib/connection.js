var ConnectionObject = require('./connectionObject');
var SqlObject = require('./sqlObject');
var QuoteString = require('./quoteString');
var ParseConnection = require('./parseConnection');
var Prepare = require('./prepare');
var Join = require('./join');
var Statement = require('./statement');
var PreparedStatement = require('./preparedStatement');


class Connection {

    constructor(conn, driver) {
        this.__base = 'string' === typeof conn ? ParseConnection(conn, driver) : ConnectionObject.fromPlain(conn, driver);
        this.__connection = this.__base.Driver.open(this.__base);
        this.__connectionUrl = 'string' === typeof conn ? conn : this.__base.makeURL();
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
     * @private
     * @returns {object}
     * @memberof Connection
     */
    get base() {
        return this.__base;
    }

    /**
     * @readonly
     * @private
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

            if ( 'function' !== typeof this.connection.close ) {
                return resolve( true ); // nothing to do
            }

            this.connection.close().then(() => {
                resolve(true);
            }).catch((reason) => {
                reject(reason);
            });
        });
    }

    /**
     * Indicates whether the underlying driver can support transactions;
     * 
     * @returns {boolean}
     * @memberof Connection
     */
    isTransactionSupported() {
        if (typeof this.connection.isTransactionSupported === 'function') {
            return this.connection.isTransactionSupported();
        }
        return false;
    }

    /**
     * Returns true if the underlying driver is in a transaction, false
     * if it does not support transactions or is not in a transaction.
     * 
     * @returns {boolean}
     * @memberof Connection
     */
    inTransaction() {
        if (this.isTransactionSupported()) {
            return this.connection.inTransaction();
        }
        return false;
    }

    /**
     * Returns a boolean promise: true if a transaction was started and
     * false if it was not started. Transactions can fail to start if
     * another transaction is already running or if the driver does 
     * not support transactions.
     * 
     * @returns {Promise<boolean>}
     * @memberof Connection
     */
    beginTransaction() {
        if (!this.isTransactionSupported()) {
            return Promise.resolve(false);
        }
        return this.connection.beginTransaction();
    }

    /**
     * Returns a boolean promise: true if a transaction was committed and
     * false if one was not committed. Transactions can fail to commit if
     * no transaction was started, or if the driver does not support
     * transactions.
     * 
     * @returns {Promise<boolean>}
     * @memberof Connection
     */
    commit() {
        if (!this.inTransaction()) {
            return Promise.resolve(false);
        }
        return this.connection.commit();
    }


    /**
     * Returns a boolean promise: true if a transaction was rolled back and
     * false if one was not rolled back. Transactions can fail to roll back if
     * no transaction was started, or if the driver does not support
     * transactions.
     * 
     * @returns {Promise<boolean>}
     * @memberof Connection
     */
    rollback() {
        if (!this.inTransaction()) {
            return Promise.resolve(false);
        }
        return this.connection.rollback();
    }
}

module.exports = Connection;