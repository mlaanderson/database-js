var Statement = require('./statement');

class PreparedStatement extends Statement {
    constructor(connection, sql) {
        super(connection, sql);
        this.prepare();
    }
}

module.exports = PreparedStatement;