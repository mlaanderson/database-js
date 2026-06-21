import { BaseStatement } from "./BaseStatement.js";
import { Driver } from "./Driver.js";
import { SqlCommand } from "./SqlCommand.js";


export class Statement implements BaseStatement {

    constructor(
        private readonly driver: Driver,
        public readonly sql: string,
    ) {
        if ( ! sql ) {
            throw new Error( 'Please inform the sql parameter.' );
        }
    }

    //
    // BaseStatement interface
    //

    async query( sql: string, ...params: any ): Promise< any > {

        const sqlWithParameters = params.length > 0
            ? ( new SqlCommand( sql ) ).make( params )
            : sql;

        return await this.driver.query( sqlWithParameters );
    }


    async execute( sql: string, ...params: any ): Promise< any > {

        const sqlWithParameters = params.length > 0
            ? ( new SqlCommand( sql ) ).make( params )
            : sql;

        return await this.driver.execute( sqlWithParameters );
    }
}
