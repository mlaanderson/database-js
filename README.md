# database-js
Common Database Interface for Node

## About
Database-js creates the structure for a common database interface. It's roughly structured on Java's database interface. It has built in prepared statements, even if the underlying driver does not support them. It is built on Promises so it works well with ES7 async code.

## Example
Database-js uses the concept of a connection string. The format of the string is:
`driver://[[[username]:[password]@]host]/database[?other parameters]`

Since drivers must have a common interface, there are a few wrappers around drivers:
#### MySQL Driver
`database-js-mysql://[[username]:[password]@]host/database`
#### ADODB
`database-js-adodb:///file_path[?parameters]`
#### Firebase
Yes, it is an SQL wrapper for a NoSQL database.
`database-js-firebase://username:password@project_id/root_node?apiKey=API_KEY`
Where the root node is the path to the parent of the entries you define as tables. The project ID and API key can get found in your Firebase console.

### Usage
#### MySQL Example
~~~~
var Database = require('database-js2').Connection;

(async function() {
    let connection, statement, rows;
    connection = new Database('database-js-mysql://my_secret_username:my_secret_password@localhost:3306/my_top_secret_database');

    try {
        statement = await connection.prepareStatement("SELECT * FROM tablea WHERE user_name = ?");
        rows = await statement.query('not_so_secret_user');
        console.log(rows);
    } catch (error) {
        console.log(error);
    } finally {
        await connection.close();
    }
})();
~~~~

#### MS Access Example
~~~~
var Database = require('database-js2').Connection;

(async function() {
    let connection, statement, rows;
    connection = new Database('database-js-adodb:///C:\\Users\\me\\Desktop\\database.mdb');

    try {
        statement = await connection.prepareStatement("SELECT * FROM tablea WHERE user_name = ?");
        rows = await statement.query('not_so_secret_user');
        console.log(rows);
    } catch (error) {
        console.log(error);
    } finally {
        await connection.close();
    }
})();
~~~~


#### MS Excel Example
~~~~
var Database = require('database-js2').Connection;

(async function() {
    let connection, statement, rows;
    connection = new Database('database-js-adodb:///C:\\Users\\me\\Desktop\\database.xls?Extended Properties='Excel 8.0;HDR=Yes;IMEX=1';');

    try {
        statement = await connection.prepareStatement("SELECT * FROM [Sheet1$A1:C52] WHERE State = ?");
        rows = await statement.query('South Dakota');
        console.log(rows);
    } catch (error) {
        console.log(error);
    } finally {
        await connection.close();
    }
})();
~~~~

#### Firebase Example
The username and password is not the Firebase account holder's email and password. These are the login credentials for an authorized user of the Firebase data. Currently the wrapper only supports [email sign in methods](https://firebase.google.com/docs/auth/web/password-auth).
~~~~
var Database = require('database-js2').Connection;

(async function() {
    let connection, statement, rows;
    connection = new Database('database-js-firebase://user@example.com:secret_password@project_id/root_path?apiKey=MY_API_KEY');

    try {
        statement = await connection.prepareStatement("SELECT * FROM users WHERE username = ?");
        rows = await statement.query('Donald Duck');
        console.log(rows);
    } catch (error) {
        console.log(error);
    } finally {
        await connection.close();
    }
})();
~~~~

## Extending
Writing a new wrapper around an existing database implementation in Node is fairly straight forward. The [database-js-mysql](https://github.com/mlaanderson/database-js-mysql) wrapper is a good place to start. Generally the pattern will be like this:
~~~~
var baseDriver = require('base-driver');

var m_connection = Symbol('connection');

class Wrapper {
    constructor(connection) {
        this[m_connection] = connection;
    }

    query(sql) {
        var self = this;
        return new Promise((resolve, reject) => {
            self[m_connection].query(sql, (error, data, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }                
            });
        });
    }

    execute(sql) {
        return new Promise((resolve, reject) => {
            self[m_connection].execute(sql, (error, data, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }                
            });
        });
    }

    close() {
        var self = this;
        return new Promise((resolve, reject) => {
            self[m_connection].close((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = {
    open: function(connection) {
        let base = baseDriver.createConnection({
            host: connection.Hostname || 'localhost',
            port: parseInt(connection.Port) || 3306,
            user: connection.Username,
            password: connection.Password,
            database: connection.Database
        })
        return new Wrapper(base);
    }
};
~~~~

## Adding SQL interfaces to non-SQL data stores
The [database-js-firebase](https://github.com/mlaanderson/database-js-firebase) wrapper is an example of adding an SQL interface to a data store that is not SQL based. It uses [node-sqlparser](https://www.npmjs.com/package/node-sqlparser) by fish to parse the SQL statement into an object which is easy to work with. Someone could easily create a wrapper around an HTTP server, or even create an SQL interface to IoT sensors.