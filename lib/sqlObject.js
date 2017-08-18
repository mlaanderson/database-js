var QuoteString = require('./quoteString');

class SqlObject {
    constructor(chunks, indexes) {
        this.sql = chunks.join("'");
        this.indexes = indexes;
    }

    /**
     * 
     * 
     * @param {array} args 
     * @returns {string} Prepared SQL statement
     * @memberof SqlObject
     */
    map(args) {
        if (this.indexes.length !== args.length) {
            throw new Error("Number of parameters does not match required parameters");
        }

        let sql = this.sql;
        let offset = 0;
        args.map((o, n) => {
            o = QuoteString(o);
            sql = sql.substr(0, this.indexes[n] + offset) + o + sql.substr(this.indexes[n] + offset + 1);
            offset += o.length - 1;
        });

        return sql;
    }
}

module.exports = SqlObject;