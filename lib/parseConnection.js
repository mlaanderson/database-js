var ConnectionObject = require('./connectionObject');

var m_connectionRegex = /^([^:]+):\/\/(?:([^:]+)(?::([^@\/]+))?@)?(?:([^\/:]+)(?::(\d+))?)?\/([^\?]+)(?:\?(.*))?$/;

/**
 * Parses a connection string to extract the driver name,
 * username, password, hostname, port, database, and 
 * parameter string.
 * 
 * @param {string} connectionString 
 * @param {any} driver
 * @returns {ConnectionObject}
 */
function ParseConnection(connectionString, driver) {
    [match, driverName, username, password, hostname, port, database, parameters] = m_connectionRegex.exec(connectionString);
    return new ConnectionObject(driverName, username, password, hostname, port, database, parameters, driver);
}

module.exports = ParseConnection;