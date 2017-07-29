var Database = require('database-js2').Connection;

(async function() {
    let connection, statement, rows;
    connection = new Database('database-js-firebase://user@example.com:password@statesdemo/ewJviY6wboTKJ57A2dZkvq8kxYo1?apiKey=AIzaSyD1ypTmnJb_d8ZOyfc-KBMe0tw8owYCwjA');

    try {
        statement = await connection.prepareStatement("SELECT * FROM states ORDER BY Ranking");
        rows = await statement.query();
        console.log(rows);
    } catch (error) {
        console.log(error);
    } finally {
        await connection.close();
        setTimeout(process.exit, 0);
    }
})();