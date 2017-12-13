var Connection = require('./connection');
var PooledConnection = require('./pooledConnection');
var ParseConnection = require('./parseConnection');

var AvailablePool = {};
var InUsePool = {};

class StaticPool {

    /**
     * Constructs a static pool.
     * 
     * @param {string|ConnectionObject} conn Connection string or object.
     * @param {int} poolSize Pool size (optional).
     * @param {any} driver Driver to use (optional).
     * @memberof StaticPool
     */    
    constructor(conn, poolSize =  10, driver = undefined) {

        let url = 'string' === typeof conn ? conn : conn.makeURL();

        if (url in AvailablePool === false) {
            AvailablePool[url] = [];
        }
        if (url in InUsePool === false) {
            InUsePool[url] = [];
        }

        /** @type {string} */
        this.__url = url;
        /** @type {number} */
        this.__poolSize = poolSize;
        /** @type {class} */
        this.__driver = driver; 
        /** @type {Array<PooledConnection>} */
        this.__available = AvailablePool[this.__url];
        /** @type {Array<PooledConnection>} */
        this.__inUse = InUsePool[this.__url]

        while (this.Size > this.Count) {
            this.__addConnection();
        }
    }

    /**
     * @private
     * @memberof StaticPool
     */
    __addConnection() {
        let connection = new PooledConnection(this, this.__url, this.__driver);
        this.__available.push(connection);
    }

    /**
     * @param {PooledConnection} connection 
     * @private
     * @memberof StaticPool
     */
    __closeConnection(connection) {
        let index = this.__inUse.indexOf(connection);
        if (index >= 0) {
            this.__inUse.splice(index, 1);
            this.__available.push(connection);
        }
    }

    /**
     * The number of available connections in the pool
     * @returns {number}
     * @readonly
     * @memberof StaticPool
     */
    get Available() {
        return this.__available.length;
    }

    /**
     * The number of used connections in the pool
     * @returns {number}
     * @readonly
     * @memberof StaticPool
     */
    get InUse() {
        return this.__inUse.length;
    }

    /**
     * The total number of connections in the pool
     * @returns {number}
     * @readonly
     * @memberof StaticPool
     */
    get Count() {
        return this.Available + this.InUse;
    }

    /**
     * The prefered number of connections in the pool
     * @returns {number}
     * @readonly
     * @memberof StaticPool
     */
    get Size() {
        return this.__poolSize;
    }

    /**
     * Grabs an available connection from the pool
     * 
     * @returns {PooledConnection}
     * @memberof StaticPool
     */
    getConnection() {
        if (this.__available.length <= 0) {
            this.__addConnection();
        }
        let connection = this.__available.pop();
        this.__inUse.push(connection);
        return connection;
    }

    /**
     * Closes the underlying connections and empties the pool
     * 
     * @returns {Promise<Array<boolean>>}
     * @memberof StaticPool
     */
    close() {
        /** @type {Array<Promise<boolean>>} */
        let promises = this.__available.concat(this.__inUse).map(el => el.kill());
        return Promise.all(promises).then(values => {
            while (this.InUse > 0) { this.__inUse.pop(); }
            while (this.Available > 0) { this.__available.pop(); }
        });
    }
}

module.exports = StaticPool;