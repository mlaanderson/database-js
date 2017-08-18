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
        this.Driver = driver || require(driverName);
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

module.exports = ConnectionObject;