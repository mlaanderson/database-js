/* jshint ignore: start */
var Pool = require('.').DynamicPool;
var args = process.argv.slice(2);

if (args.length < 1) { args.push('South Dakota'); }

( async () => {
    let pool = new Pool("sqlite:///test.sqlite");
    let connection = pool.getConnection();
    let statement, results;
    try {
        statement = await connection.prepareStatement("SELECT * FROM states WHERE State = ?");
        results = await statement.query(args[0]);
        console.log(results);
    } catch (err) {
        console.log(err);
    } finally {
        await pool.close();
    }
} )();
/* jshint ignore: end */