import { Transactionable } from './Transactionable.js';
import { Driver } from "./Driver.js";
import { ConnectionObject, ConnectionParams } from "./ConnectionParams.js";
import { DriverMaker } from "./DriverMaker.js";
import { Statement } from './Statement.js';

/**
 * Connection to a database or file, local or remote.
 */
export class Connection implements Transactionable {

    constructor(
        public readonly params: ConnectionParams,
        public readonly driver: Driver
    ) {
    }

    /**
     * Creates a Statement with the given SQL command.
     *
     * @param {string} sql SQL command
     * @returns {Statement}
     */
    prepareStatement( sql: string ): Statement {
        return new Statement( this.driver, sql );
    }

    /** Closes the underlying connection  */
    async close(): Promise< void > {
        await this.driver.close();
    }

    //
    // Transactionable interface
    //

    isTransactionSupported(): boolean {
        return this.driver.isTransactionSupported();
    }

    inTransaction(): boolean {
        if ( this.isTransactionSupported() ) {
            return this.driver.inTransaction();
        }
        return false;
    }

    async beginTransaction(): Promise< boolean > {
        return await this.driver.beginTransaction();
    }

    async commit(): Promise< boolean > {
        return await this.driver.commit();
    }

    async rollback(): Promise< boolean > {
        return await this.driver.rollback();
    }
}


/**
 * Creates a Connection.
 *
 * @param {string|ConnectionObject} connectionStringOrParams Connection parameters.
 * @param {boolean}[detectParametersTypes=false] Flag to detect connection parameter types.
 * @returns {Connection}
 */
export async function connect(
    connectionStringOrParams: string|ConnectionObject,
    detectParametersTypes: boolean = false
): Promise< Connection > {

    const params = ( typeof connectionStringOrParams === 'string' )
            ? ConnectionParams.fromString( connectionStringOrParams, detectParametersTypes )
            : new ConnectionParams( connectionStringOrParams, detectParametersTypes );

    if ( ! params ) {
        throw new Error( 'Invalid connection parameters.' );
    }

    const maker: DriverMaker = await loadDriverMaker( params.driverName );
    const driver = maker.open( params );

    return new Connection( params, driver );
}


/**
 * Loads a DriverMaker from the driver name.
 *
 * @param {string} driverName
 * @returns {DriverMaker}
 */
async function loadDriverMaker( driverName: string ): Promise< DriverMaker > {
    const moduleName = driverName.startsWith( 'database-js-' ) ? driverName : `database-js-${driverName}`;
    const module = await import( moduleName );
    if ( ! module.default ) {
        throw new Error( `The module "${driverName}" needs to have a default export.` );
    }
    return module.default;
}
