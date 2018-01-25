# Database-js

* [Install](#install)
* [API](//github.com/mlaanderson/database-js/wiki/API)
* [Examples](//github.com/mlaanderson/database-js/wiki/Examples)
* [Drivers](//github.com/mlaanderson/database-js/wiki/Drivers)
* [In the Browser](//github.com/mlaanderson/database-js/wiki/Browsers)

## About
Database-js was started to implement a common, promise-based interface for SQL database access. The concept is to copy the Java pattern of using connection strings to identify the driver. Then provide wrappers around the implemented functionality to commonize the syntax and results.

Thus if SQLite, MySQL and PostgreSQL all have a database named test with a table named states we can access the data the same way.

Since *database-js* is still being held onto by NPM, the current package name is **database-js2**.

Database-js has built-in prepared statements, even if the underlying driver does not support them. It is built on Promises, so it works well with ES7 async code.

## Drivers

Currently available drivers:
- [MySQL](//github.com/mlaanderson/database-js-mysql)
- [PostgreSQL](//github.com/mlaanderson/database-js-postgresql)
- [SQLite](//github.com/mlaanderson/database-js-sqlite)
- [ActiveX Data Objects](//github.com/mlaanderson/database-js-adodb)
- [Firebase](//github.com/mlaanderson/database-js-firebase)
- [INI files](//github.com/mlaanderson/database-js-ini)
- [Excel files](//github.com/mlaanderson/database-js-xlsx)
- [CSV files](//github.com/mlaanderson/database-js-csv)
- [JSON files](//github.com/thiagodp/database-js-json)

[See here](https://github.com/mlaanderson/database-js/wiki/Drivers#implementing-a-new-driver) how to add a new driver.

## Install

```shell
npm install database-js2
```

## Usage

### SQLite
```javascript
var Connection = require('database-js2').Connection;

var conn = new Connection("sqlite:///path/to/test.sqlite");

var statement = conn.prepareStatement("SELECT * FROM states WHERE state = ?");
statement.query("South Dakota").then((results) => {
    console.log(results);
    conn.close().then(() => {
        process.exit(0);
    }).catch((reason) => {
        console.log(reason);
        process.exit(1);
    });
}).catch((reason) => {
    console.log(reaons);
    conn.close().then(() => {
        process.exit(0);
    }).catch((reason) => {
        console.log(reason);
        process.exit(1);
    });
});
```

### MySQL
```javascript
var Connection = require('database-js2').Connection;

var conn = new Connection("mysql://user:password@localhost/test");

var statement = conn.prepareStatement("SELECT * FROM states WHERE state = ?");
statement.query("South Dakota").then((results) => {
    console.log(results);
    conn.close().then(() => {
        process.exit(0);
    }).catch((reason) => {
        console.log(reason);
        process.exit(1);
    });
}).catch((reason) => {
    console.log(reaons);
    conn.close().then(() => {
        process.exit(0);
    }).catch((reason) => {
        console.log(reason);
        process.exit(1);
    });
});
```

### PostgreSQL
```javascript
var Connection = require('database-js2').Connection;

var conn = new Connection("postgres://user:password@localhost/test");

var statement = conn.prepareStatement("SELECT * FROM states WHERE state = ?");
statement.query("South Dakota").then((results) => {
    console.log(results);
    conn.close().then(() => {
        process.exit(0);
    }).catch((reason) => {
        console.log(reason);
        process.exit(1);
    });
}).catch((reason) => {
    console.log(reaons);
    conn.close().then(() => {
        process.exit(0);
    }).catch((reason) => {
        console.log(reason);
        process.exit(1);
    });
});
```

Notice that in all three examples, the only difference is the connection URL.

### ES7 Compatibility: async
Because database-js is built on Promises, it works very well with ES7 async functions. Compare the following ES7 code to the SQLite code from above. They accomplish the same thing.
```javascript
var Connection = require('database-js2').Connection;

(async function() {
    let conn, statement, results;
    
    try {
        conn = new Connection("sqlite:///path/to/test.sqlite");
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

## License

[MIT](https://github.com/mlaanderson/database-js/blob/master/LICENSE) (c) [mlaanderson](https://github.com/mlaanderson)
