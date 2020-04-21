# database-js

[![Build Status](https://travis-ci.org/mlaanderson/database-js.svg?branch=master)](https://travis-ci.org/mlaanderson/database-js)
[![npm version](https://badge.fury.io/js/database-js.svg)](https://badge.fury.io/js/database-js)
[![Mentioned in Awesome Node.js](https://awesome.re/mentioned-badge.svg)](https://github.com/sindresorhus/awesome-nodejs)

> Wrapper for multiple databases with a JDBC-like connection

Database-js implements a common, promise-based interface for SQL database access. Inspired by Java, it uses connection strings to identify the database driver. Wrappers around native database drivers provide a unified interface to handle databases. Thus, you don't need to modify your code (except the connection string) to change your database! 😉

Database-js has built-in prepared statements, even if the underlying driver does not support them. It is built on Promises, so it works well with ES7 async code.

## Contents

* [Install](#install)
* [Usage](#usage)
* [Examples](//github.com/mlaanderson/database-js/wiki/Examples)
* [API](//github.com/mlaanderson/database-js/wiki/API)
* [Drivers](//github.com/mlaanderson/database-js/wiki/Drivers)
* [In the Browser](//github.com/mlaanderson/database-js/wiki/Browsers)

## Install

```shell
npm install database-js
```

## Drivers

| Driver (wrapper) | Note | Installation |
| ---------------- | ---- | ------------ |
| [ActiveX Data Objects](//github.com/mlaanderson/database-js-adodb) | *Windows only* | `npm i database-js-adodb` |
| [CSV files](//github.com/mlaanderson/database-js-csv) | | `npm i database-js-csv` |
| [Excel files](//github.com/mlaanderson/database-js-xlsx) | | `npm i database-js-xlsx` |
| [Firebase](//github.com/mlaanderson/database-js-firebase) | | `npm i database-js-firebase` |
| [INI files](//github.com/mlaanderson/database-js-ini) | | `npm i database-js-ini` |
| [JSON files](//github.com/thiagodp/database-js-json) | | `npm i database-js-json` |
| [MySQL](//github.com/mlaanderson/database-js-mysql) | | `npm i database-js-mysql` |
| [MS SQL Server](https://github.com/thiagodp/database-js-mssql) | | `npm i database-js-mssql` |
| [PostgreSQL](//github.com/mlaanderson/database-js-postgres) | | `npm i database-js-postgres` |
| [SQLite](//github.com/mlaanderson/database-js-sqlite) | | `npm i database-js-sqlite` |

[See here](//github.com/mlaanderson/database-js/wiki/Drivers#implementing-a-new-driver) how to add a new driver.

## Usage

```javascript
var Connection = require('database-js').Connection;

// 👉 Change the connection URL according to the database you need to connect
var conn =
	new Connection("sqlite:///path/to/test.sqlite"); // SQLite
	// new Connection("mysql://user:password@localhost/test"); // MySQL
	// new Connection("postgres://user:password@localhost/test"); // PostgreSQL
	// new Connection( < ANOTHER URL HERE > ); // see the drivers

var statement = conn.prepareStatement("SELECT * FROM states WHERE state = ?");
statement.query("South Dakota")
	.then((results) => {
		console.log(results); // Display the results
		conn.close() // Close the database connection
			.then(() => {
				process.exit(0); // Success!
			}).catch((reason) => {
				console.log(reason); // Some problem when closing the connection
				process.exit(1);
			});
	}).catch((reason) => {
		console.log(reason); // Some problem while performing the query
		conn.close() // Close the connection
			.then(() => {
				process.exit(0); // Success!
			}).catch((reason) => {
				console.log(reason); // Some problem when closing the connection
				process.exit(1);
			});
	});
```

### Async / await

Because **database-js** is built on Promises, it works very well with [async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/async_function). Compare the following code to the code from above. They accomplish the same thing.
```javascript
var Connection = require('database-js').Connection;

(async function() {
    let conn, statement, results;
    try {
        conn = new Connection("sqlite:///path/to/test.sqlite"); // Just change the connection URL for a different database
        statement = conn.prepareStatement("SELECT * FROM states WHERE state = ?");
        results = await statement.query("South Dakota");
        console.log(results);
    } catch (reason) {
        console.log(reason);
    } finally {
        if (conn) {
            await conn.close();
        }
        process.exit(0);
    }
})();
```

## See also

[codeceptjs-dbhelper](https://github.com/thiagodp/codeceptjs-dbhelper) - Allows to use [database-js](https://github.com/mlaanderson/database-js) inside [CodeceptJS](https://github.com/codeception/codeceptjs/) to setup tests that access databases.

## License

[MIT](LICENSE)
