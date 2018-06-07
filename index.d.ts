declare namespace databasejs {

    interface ConnectionStruct {
        driverName?: string;
        DriverName?: string;
        username?:string;
        Username?:string;
        password?:string;
        Password?:string;
        hostname?:string;
        Hostname?:string;
        port?:string;
        Port?:string;
        database?:string;
        Database?:string;
        parameters?:string;
        Parameters?:string;
    }

    class  ConnectionObject {
        constructor(driverName: string, username: string, password: string, hostname: string, port: string, database: string, driver?: any);

        /** Splits the parameter string into an object of key/value pairs */
        parseParameters() : Object;

        /** Makes a URL from this ConnectionObject */
        makeURL() : string;

        /** Allows plain object to be used to construct a ConnectionObject */
        static fromPlain(obj: ConnectionStruct, driver?: any): ConnectionObject;
    }

    class Statement {
        /**
         * Executes the SQL query. If any parameters are required, they
         * will be passed to the query here.
         * 
         * @param {any[]} args arguments to replace into the prepared SQL string
         * @returns {Promise<Array<any>}
         * @memberof Statement
         */
        query(... args: any[]) : Promise<Array<any>>;

        /**
         * Prepares the statement for use with parameters.
         * 
         * @memberof Statement
         */
        prepare() : void;

        /**
         * Executes the SQL statement. If any parameters are required, they
         * will be passed in here.
         * 
         * @param {any[]} args arguments to replace into the prepared SQL string
         * @returns {Promise<any>}
         * @memberof Statement
         */
        execute(... args: any[]) : Promise<void | Array<any>>;
    }

    class PreparedStatement extends Statement {}

    class Connection {
        constructor(url: string | ConnectionStruct, driver?: any);

        readonly URL: string;
        readonly Driver: Object;
        
        /**
         * Creates a statement with the passed SQL.
         * 
         * @param {string} sql the SQL string to use for the statement
         * @returns {Statement} a Statement object
         * @memberof Connection
         */
        createStatement(sql: string) : Statement;

        /**
         * Creates and prepares a statement with the passed SQL.
         * 
         * @param {string} sql the SQL string to use for the statement
         * @returns {PreparedStatement} a PreparedStatement object
         * @memberof Connection
         */
        prepareStatement(sql: string) : PreparedStatement;

        /**
         * Closes the underlying connection.
         * 
         * @returns {Promise<boolean>}
         * @memberof Connection
         */
        close() : Promise<boolean>;

        /**
         * Indicates whether the underlying driver can support transactions;
         * 
         * @returns {boolean}
         * @memberof Connection
         */
        isTransactionSupported() : boolean;

        /**
         * Returns true if the underlying driver is in a transaction, false
         * if it does not support transactions or is not in a transaction.
         * 
         * @returns {boolean}
         * @memberof Connection
         */
        inTransaction() : boolean;

        /**
         * Returns a boolean promise: true if a transaction was started and
         * false if it was not started. Transactions can fail to start if
         * another transaction is already running or if the driver does 
         * not support transactions.
         * 
         * @returns {Promise<boolean>}
         * @memberof Connection
         */
        beginTransaction() : Promise<boolean>;

        /**
         * Returns a boolean promise: true if a transaction was committed and
         * false if one was not committed. Transactions can fail to commit if
         * no transaction was started, or if the driver does not support
         * transactions.
         * 
         * @returns {Promise<boolean>}
         * @memberof Connection
         */
        commit() : Promise<boolean>;

        /**
         * Returns a boolean promise: true if a transaction was rolled back and
         * false if one was not rolled back. Transactions can fail to roll back if
         * no transaction was started, or if the driver does not support
         * transactions.
         * 
         * @returns {Promise<boolean>}
         * @memberof Connection
         */
        rollback() : Promise<boolean>;
    }

    class PooledConnection extends Connection {
        /**
         * Closes the connection completely
         * 
         * @returns {Promise<boolean>}
         * @memberof PooledConnection
         */
        kill() : Promise<boolean>;

        /**
         * Frees this connection for the pool
         * 
         * @returns {Promise<boolean>}
         * @memberof PooledConnection
         */
        close() : Promise<boolean>;
    }

    interface Pool {
        /**
         * The number of used connections in the pool
         * @returns {number}
         * @readonly
         * @memberof Pool
         */
        readonly Available : number;

        /**
         * The number of used connections in the pool
         * @returns {number}
         * @readonly
         * @memberof Pool
         */
        readonly InUse : number;

        /**
         * The total number of connections in the pool
         * @returns {number}
         * @readonly
         * @memberof Pool
         */
        readonly Count : number; 

        /**
         * The prefered number of connections in the pool
         * @returns {number}
         * @readonly
         * @memberof Pool
         */
        readonly Size : number;

        /**
         * Grabs an available connection from the pool
         * 
         * @returns {PooledConnection}
         * @memberof Pool
         */
        getConnection() : PooledConnection;

        /**
         * Closes the underlying connections and empties the pool
         * 
         * @returns {Promise<Array<boolean>>}
         * @memberof Pool
         */
        close() : Promise<Array<boolean>>
    }

    class StaticPool implements Pool {
        constructor(url: string | ConnectionObject, poolSize: number, driver?: any);
        
        /**
         * The number of used connections in the pool
         * @returns {number}
         * @readonly
         * @memberof Pool
         */
        readonly Available : number;

        /**
         * The number of used connections in the pool
         * @returns {number}
         * @readonly
         * @memberof Pool
         */
        readonly InUse : number;

        /**
         * The total number of connections in the pool
         * @returns {number}
         * @readonly
         * @memberof Pool
         */
        readonly Count : number; 

        /**
         * The prefered number of connections in the pool
         * @returns {number}
         * @readonly
         * @memberof Pool
         */
        readonly Size : number;

        /**
         * Grabs an available connection from the pool
         * 
         * @returns {PooledConnection}
         * @memberof Pool
         */
        getConnection() : PooledConnection;

        /**
         * Closes the underlying connections and empties the pool
         * 
         * @returns {Promise<Array<boolean>>}
         * @memberof Pool
         */
        close() : Promise<Array<boolean>>
    }

    class DynamicPool implements Pool {
        constructor(url: string | ConnectionObject, poolSize: number, driver?: any);
        
        /**
         * The number of used connections in the pool
         * @returns {number}
         * @readonly
         * @memberof Pool
         */
        readonly Available : number;

        /**
         * The number of used connections in the pool
         * @returns {number}
         * @readonly
         * @memberof Pool
         */
        readonly InUse : number;

        /**
         * The total number of connections in the pool
         * @returns {number}
         * @readonly
         * @memberof Pool
         */
        readonly Count : number; 

        /**
         * The prefered number of connections in the pool
         * @returns {number}
         * @readonly
         * @memberof Pool
         */
        readonly Size : number;

        /**
         * Grabs an available connection from the pool
         * 
         * @returns {PooledConnection}
         * @memberof Pool
         */
        getConnection() : PooledConnection;

        /**
         * Closes the underlying connections and empties the pool
         * 
         * @returns {Promise<Array<boolean>>}
         * @memberof Pool
         */
        close() : Promise<Array<boolean>>
    }

}

export = databasejs;