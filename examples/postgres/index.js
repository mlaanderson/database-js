var Database = require('database-js2').Connection;

(async function main(){
    let connection = new Database("database-js-postgres://user:password@localhost/test");
    let statement, results;

    try {
        statement = await connection.prepareStatement("SELECT * FROM states WHERE name = ?");
        results = await statement.query('South Dakota');
        console.log(results);
    } catch (err) {
        console.log(err);
    } finally {
        connection.close();
    }
})();