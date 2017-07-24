var Database = require('.').Connection;

(async function () { 
    let dbUrl = `database-js-adodb:///test.xls?Extended Properties='Excel 8.0;HDR=Yes;IMEX=1';`;
    let db = new Database(dbUrl);
    let records, stmt;
    try {
        stmt = await db.prepareStatement("SELECT * FROM [Sheet1$A1:C52] ORDER BY Population ASC");
        records = await stmt.query();
        console.log(JSON.stringify(records, null, 4));
        await db.close();
        setTimeout(process.exit, 0);
    } catch (err) {
        console.log(err);
        setTimeout(process.exit, 0);
    }
})();
