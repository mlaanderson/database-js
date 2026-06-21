import { Transactionable } from "./Transactionable.js";

export interface Driver extends Transactionable {

    query( sql: string ): Promise< any >;

    execute( sql: string ): Promise< any >;

    close(): Promise< void >;

}
