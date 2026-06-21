# database-js

[![npm version](https://badge.fury.io/js/database-js.svg)](https://badge.fury.io/js/database-js)
[![Mentioned in Awesome Node.js](https://awesome.re/mentioned-badge.svg)](https://github.com/sindresorhus/awesome-nodejs)
![downloads](https://img.shields.io/npm/dw/database-js)

> Wrapper for multiple databases with a JDBC-like connection

Database-js implements a common, promise-based interface for database access. Inspired by JDBC, it uses connection strings to identify a database driver. Wrappers around native database drivers provide a unified interface for handling databases and even files. The target database can be change by modifying the connection string. 😉

## Contents

* [Install](#install)
* [Usage](#usage)
* [Examples](//github.com/mlaanderson/database-js/wiki/Examples)
* [API](//github.com/mlaanderson/database-js/wiki/API)
* [Drivers](//github.com/mlaanderson/database-js/wiki/Drivers)
* [In the Browser](//github.com/mlaanderson/database-js/wiki/Browsers)

## Install

```shell
npm i database-js
```

> Version 4 has a modern, ESM-based interface. Version 3 uses the legacy CommonJS-based interface.

## Drivers

| Driver (wrapper) | Note | Installation | Works with v3 | Works with v4 |
| ---------------- | ---- | ------------ |--------------------|--------------------|
| [ActiveX Data Objects](//github.com/mlaanderson/database-js-adodb) | *Windows only* | `npm i database-js-adodb` | Yes | Not checked yet |
| [CSV files](//github.com/mlaanderson/database-js-csv) | | `npm i database-js-csv` | Yes | Not checked yet |
| [Excel files](//github.com/mlaanderson/database-js-xlsx) | | `npm i database-js-xlsx` | Yes | Not checked yet |
| [Firebase](//github.com/mlaanderson/database-js-firebase) | | `npm i database-js-firebase` | Yes | Not checked yet |
| [INI files](//github.com/mlaanderson/database-js-ini) | | `npm i database-js-ini` | Yes | Not checked yet |
| [JSON files](//github.com/thiagodp/database-js-json) | | `npm i database-js-json` | Yes | Not checked yet |
| [MySQL](//github.com/mlaanderson/database-js-mysql) | prior to MySQL v8 | `npm i database-js-mysql` | Yes | Not checked yet |
| [MySQL2](//github.com/esteban-serfe/database-js-mysql2/) | MySQL v8+ | `npm i database-js-mysql2` | Yes | Not checked yet |
| [MS SQL Server](https://github.com/thiagodp/database-js-mssql) | | `npm i database-js-mssql` | Yes | Not checked yet |
| [PostgreSQL](//github.com/mlaanderson/database-js-postgres) | | `npm i database-js-postgres` | Yes | Not checked yet |
| [SQLite3](//github.com/thiagodp/database-js-sqlite3) | | `npm i database-js-sqlite3` | Yes | Not checked yet |
| [SQLite](//github.com/mlaanderson/database-js-sqlite) | | `npm i database-js-sqlite` | Yes | Not checked yet |

See also [how to add a new driver](//github.com/mlaanderson/database-js/wiki/Drivers#implementing-a-new-driver).

## Usage

> Examples for version 4

```javascript
import { connect } from 'database-js';

let conn;
try {
	conn = await connect( 'mysql://user:password@localhost/exampledb' );

	const stmt1 = conn.prepareStatement( 'SELECT * FROM city WHERE name = ?' );
	const results = await stmt1.query( 'New York' );
	console.log( results );

	const stmt2 = conn.prepareStatement( 'INSERT INTO city (name, population) VALUES ( ?, ? )' );
	await stmt2.execute( 'Rio de Janeiro', 6747815 );

	const stmt3 = conn.prepareStatement( 'UPDATE city SET population = population + ? WHERE name = ?' );
	await stmt3.execute( 1, 'Rio de Janeiro' );

} catch ( error ) {
	console.error( error.message );
} finally {
	try {
		await conn?.close();
	} catch ( error ) {
		console.error( error.message );
	}
}
```

## API

> Version 4's basic API

```ts
class Connection {

	/** Creates a statement from the given SQL. */
	prepareStatement(sql: string): Statement;

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
class Statement {
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
