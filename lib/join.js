var QuoteString = require('./quoteString');

function Join(preparedSql, args) {
    if (preparedSql.indexes.length !== args.length) {
        throw new Error("Number of parameters does not match required parameters");
    }

    let sql = preparedSql.sql;
    let offset = 0;
    args.map((o, n) => {
        o = QuoteString(o);
        sql = sql.substr(0, preparedSql.indexes[n] + offset) + o + sql.substr(preparedSql.indexes[n] + offset + 1);
        offset += o.length - 1;
    });

    return sql;
}

module.exports = Join;