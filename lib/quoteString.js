/**
 * Quotes a string for SQL statements
 * 
 * @param {string|number} string 
 * @returns {string} the quoted string, or the passed parameter if it is a finite number
 */
function QuoteString(string) {
    if (typeof string === 'number') {
        if (Number.isFinite(string) === false) {
            return QuoteString(string.toString());
        }
        return string.toString();
    } else if (string === null) {
        return 'null';
    }
    string = string.toString();
    string = string.replace(/\\/g, '\\\\');
    string = string.replace(/\x00/g, '\\x00');
    string = string.replace(/\n/g, '\\n');
    string = string.replace(/\r/g, '\\r');
    string = string.replace(/'/g, "''");
    return "'" + string + "'";
}

module.exports = QuoteString;
