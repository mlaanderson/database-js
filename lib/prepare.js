var SqlObject = require('./sqlObject');

/**
 * Prepares an SQL statement for use. Parses it into chunks of quoted
 * strings and non-quoted strings. Maps all the ?'s for future use.
 * 
 * @param {string} sql 
 * @returns {SqlObject}
 */
function Prepare(sql) {
    // break the sql into chunks of quoted and none quoted
    // every odd indexed element is quoted
    let chunks = sql.split("'");
    let indexes = [];
    let pos = 0;

    if (chunks.length % 2 === 0) {
        // if there's an even number of chunks, then the quotes aren't balanced
        throw new Error("Unbalanced quotes");
    }

    chunks.map((chunk, n) => {
        if (n % 2 === 1) {
            pos += chunk.length + 2;
            return;
        }
        let subPos = -1;
        while ((subPos = chunk.indexOf("?", subPos + 1)) >= 0) {
            indexes.push(pos + subPos);
        }
        pos += chunk.length;
    });

    return new SqlObject(chunks, indexes);
}

module.exports = Prepare;