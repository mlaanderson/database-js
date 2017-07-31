var Database = require('.').Connection;
var args = process.argv.slice(2);

if (args.length < 1) { args.push('South Dakota'); }

(async function main(){
    let connection = new Database("database-js-sqlite:///test.sqlite");
    let statement, results;

    try {
        statement = await connection.prepareStatement("SELECT * FROM states WHERE State = ?");
        results = await statement.query(args[0]);
        console.log(results);
    } catch (err) {
        console.log(err);
    } finally {
        await connection.close();
    }
})();
