/**
 * Loads a module or returns false if it is not available.
 * @param {string} driver_name 
 */
function loadModule(driver_name) {
    try {
        require.resolve(driver_name);
        return require(driver_name);
    } catch (error) {
        return false;
    }
}

/**
 * Maps the connection components into a constrained object. Adds the
 * parseParameters helper function
 * 
 * @class ConnectionObject
 */
class ConnectionObject {

    /**
     * Creates an instance of ConnectionObject.
     * @param {string} driverName 
     * @param {string} username 
     * @param {string} password 
     * @param {string} hostname 
     * @param {string} port 
     * @param {string} database 
     * @param {string} parameters 
     * @param {any} driver
     * @memberof ConnectionObject
     */
    constructor(driverName, username, password, hostname, port, database, parameters, driver) {
        this.DriverName = driverName;
        this.Driver = driver || loadModule('database-js-' + driverName) || loadModule('jsdbc-' + driverName) || require(driverName);
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

    /**
     * Makes a URL from the parameters.
     * 
     * @return {string}
     * @memberof ConnectionObject
     */
    makeURL() {
        return this.DriverName + '://' +
            ( this.Username ? this.Username : '' ) +
            ( this.Password ? ':' + this.Password : '' ) +
            ( this.Hostname ? '@' + this.Hostname : '' ) +
            ( this.Port ? ':' + this.Port : '' ) +
            '/' + this.Database +
            ( this.Parameters ? '?' + this.parseParameters() : '' )
            ;
    }

    /**
     * Creates a new connection object from a plain object.
     * 
     * @param {object} obj 
     * @param {any} driver 
     * @returns {ConnectionObject}
     * @memberof ConnectionObject
     */
    static fromPlain( obj, driver ) {
        return new ConnectionObject(
            obj[ 'driverName' ] || obj[ 'DriverName' ], 
            obj[ 'username' ]   || obj[ 'Username' ],
            obj[ 'password' ]   || obj[ 'Password' ],
            obj[ 'hostname' ]   || obj[ 'Hostname' ],
            obj[ 'port' ]       || obj[ 'Port' ],
            obj[ 'database' ]   || obj[ 'Database' ],
            obj[ 'parameters' ] || obj[ 'Parameters' ],
            driver
        );
    }

}

module.exports = ConnectionObject;