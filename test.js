var Database = require('.').Connection;

(async function () { 
    let dbUrl = `database-js-sqlite:///test.sqlite`;
    let db = new Database(dbUrl);
    let records, stmt;
    try {
        stmt = await db.prepareStatement("SELECT * FROM states ORDER BY State ASC");
        records = await stmt.query();
        console.log(JSON.stringify(records, null, 4));
        await db.close();
        setTimeout(process.exit, 0);
    } catch (err) {
        console.log(err);
        setTimeout(process.exit, 0);
    }
})();
