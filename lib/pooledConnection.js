var Connection = require('./connection');
var StaticPool = require('./staticPool');

class PooledConnection extends Connection {
    /**
     * Creates an instance of PooledConnection.
     * @param {StaticPool} pool 
     * @param {string} connectionString 
     * @param {any} driver 
     * @memberof PooledConnection
     */
    constructor(pool, connectionString, driver) {
        super(connectionString, driver);

        if (typeof this.Driver.pool === "function") {
            this.Driver.pool(this);
        }

        this.__pool = pool;
    }

    kill() {
        return super.close();
    }

    /**
     * Frees this connection for the pool
     * 
     * @returns {Promise<boolean>}
     * @memberof PooledConnection
     */
    close() {
        return new Promise((resolve, reject) => {
            this.__pool.__closeConnection(this);
            resolve(true);
        });
    }
}

module.exports = PooledConnection;