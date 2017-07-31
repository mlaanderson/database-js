var Database = require('.').Connection;

(async function main(){
    let connection = new Database("database-js-sqlite:///test.sqlite");
    let statement, results;

    try {
        statement = await connection.prepareStatement("SELECT * FROM states WHERE State = ?");
        results = await statement.execute2('South Dakota');
        console.log(results);
    } catch (err) {
        console.log(err);
    } finally {
        connection.close();
    }
})();
