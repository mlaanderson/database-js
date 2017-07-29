var Database = require('database-js2').Connection;

(async function main(){
    let connection = new Database("database-js-adodb:///test.xls?Extended Properties='Excel 8.0;HDR=Yes;IMEX=1';");
    let statement, results;

    try {
        statement = await connection.prepareStatement("SELECT * FROM [Sheet1$A1:C52] WHERE State = ?");
        results = await statement.query('South Dakota');
        console.log(results);
    } catch (err) {
        console.log(err);
    } finally {
        connection.close();
    }
})();