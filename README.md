# database-js

[![Build Status](https://travis-ci.org/mlaanderson/database-js.svg?branch=master)](https://travis-ci.org/mlaanderson/database-js)
[![npm version](https://badge.fury.io/js/database-js.svg)](https://badge.fury.io/js/database-js)
[![Mentioned in Awesome Node.js](https://awesome.re/mentioned-badge.svg)](https://github.com/sindresorhus/awesome-nodejs)
![downloads](https://img.shields.io/npm/dw/database-js)

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

// CONNECTION
var conn =
	new Connection("sqlite:///path/to/test.sqlite");               // SQLite
	// new Connection("mysql://user:password@localhost/test");     // MySQL
	// new Connection("postgres://user:password@localhost/test");  // PostgreSQL
	// 👉 Change the connection string according to the database driver

// QUERY
var stmt1 = conn.prepareStatement("SELECT * FROM city WHERE name = ?");
stmt1.query("New York")
	.then( function (results) {
		console.log(results); // Display the results
	} ).catch( function (reason) {
		console.log(reason); // Some problem while performing the query
	} );

// COMMAND
var stmt2 = conn.prepareStatement("INSERT INTO city (name, population) VALUES (?, ?)");
stmt2.execute("Rio de Janeiro", 6747815)
	.then( function() { console.log( 'Inserted.' ); } )
	.catch( function(reason) { console.log('Error: ' + reason); } );

// ANOTHER COMMAND
var stmt3 = conn.prepareStatement("UPDATE city SET population = population + ? WHERE name = ?");
stmt3.execute(1, "Rio de Janeiro")
	.then( function() { console.log( 'Updated.' ); } )
	.catch( function(reason) { console.log('Error: ' + reason); } );

// CLOSING THE CONNECTION
conn.close()
	.then( function() { console.log('Closed.'); } )
	.catch( function(reason) { console.log('Error: ' + reason); } );
```

### Async / await

Because **database-js** is built on Promises, it works very well with [async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/async_function). Compare the following code to the code from above. They accomplish the same thing.
```javascript
const Connection = require('database-js').Connection;

(async () => {
	let conn;
	try {
		// CONNECTION
		conn = new Connection('mysql://user:password@localhost/test');

		// QUERY
		const stmt1 = conn.prepareStatement('SELECT * FROM city WHERE name = ?');
		const results = await stmt1.query('New York');
		console.log(results);

		// COMMAND 1
		const stmt2 = conn.prepareStatement('INSERT INTO city (name, population) VALUES (?,?)');
		await stmt1.execute('Rio de Janeiro', 6747815);

		// COMMAND 2
		const stmt2 = conn.prepareStatement('UPDATE city SET population = population + ? WHERE name = ?');
		await stmt1.execute(1, 'Rio de Janeiro');
	} catch (reason) {
		console.log(reason);
	} finally {
		try {
			await conn.close();
		} catch (err) {
			console.log(err);
		}
	}
})();
```

## Basic API

See the source code for the full API.

```ts
class Connection {

	/** Creates and prepares a statement with the given SQL. */
	prepareStatement(sql: string): PreparedStatement;

	/** Closes the underlying connection. */
	close(): Promise<void>;

	/** Indicates whether the underlying driver support transactions. */
	isTransactionSupported(): boolean;

	/** Returns true if the underlying driver is in a transaction, false otherwise. */
	inTransaction(): boolean;

	/**
	 * Starts a transaction (if supported).
	 *
	 * Transactions can fail to start if another transaction is already running or
	 * if the driver does not support transactions.
	 */
	beginTransaction(): Promise<boolean>;

	/**
	 * Commits a transaction (if supported).
	 *
	 * Transactions can fail to commit if no transaction was started, or if the driver
	 * does not support transactions.
	 */
	commit(): Promise<boolean>;

	/**
	 * Cancels a transaction (if supported).
	 *
	 * Transaction can fail to be rolled back no transaction was started, or if the driver
	 * does not support transactions.
	 */
	rollback(): Promise<boolean>;
}
```

```ts
class PreparedStatement {
	/**
	 * Performs the prepared SQL query with the given arguments.
	 * Returns a Promise with an array of rows.
	 */
	query(...args: any): Promise<Array<any>>;

	/** Executes the prepared SQL statement with the given arguments. */
	execute(... args): Promise<any>;
}
```


## See also

- [Wiki](https://github.com/mlaanderson/database-js/wiki) for more examples and how to use a connection pool.

- [codeceptjs-dbhelper](https://github.com/thiagodp/codeceptjs-dbhelper) - Allows to use [database-js](https://github.com/mlaanderson/database-js) inside [CodeceptJS](https://github.com/codeception/codeceptjs/) tests (as a helper).


## License

[MIT](LICENSE)
