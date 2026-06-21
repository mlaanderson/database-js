type SplitCommand = { chunks: string[], indexes: number[] };

export class SqlCommand {

    private readonly splitCommand: SplitCommand;

    constructor( public readonly sql: string ) {
        this.splitCommand = this.splitIntoChunks( sql );
    }

    protected splitIntoChunks( sql: string ): SplitCommand {

        // Break the sql into chunks of quoted and unquoted strings. Every odd indexed element is quoted.
        let chunks: string[] = sql.split( "'" );
        let indexes: number[] = [];
        let pos: number = 0;

        if ( chunks.length % 2 === 0 ) {
            // if there's an even number of chunks, then the quotes aren't balanced
            throw new Error( 'Unbalanced quotes' );
        }

        chunks.forEach( (chunk, n ) => {
            if ( n % 2 === 1 ) {
                pos += chunk.length + 2;
                return;
            }
            let subPos = -1;
            while ( ( subPos = chunk.indexOf( "?", subPos + 1 ) ) >= 0) {
                indexes.push(pos + subPos);
            }
            pos += chunk.length;
        } );

        return { chunks, indexes };
    }


    public make( params: any[] ): string {

        const cmd = this.splitCommand;

        if ( params.length != cmd.indexes.length ) {
            throw new Error( 'Incorrect number of parameters.' );
        }

        let sql = cmd.chunks.join( "'" );
        let offset = 0;
        params.forEach( ( value: any, index: number ) => {

            let stringValue = this.valueToString( value );

            const pos = cmd.indexes[ index ] + offset;

            sql = sql.substring( 0, pos ) + stringValue + sql.substring( pos + 1 );

            offset += stringValue.length - 1;
        } );

        return sql;
    }


    protected valueToString( value: any ): string {
        if ( value === null ) {
            return 'null';
        } else if ( typeof value === 'number' ) {
            if ( ! Number.isFinite( value ) ) {
                return this.toQuotedString( value );
            }
            return value.toString();
        }
        return this.toQuotedString( value );
    }


    protected toQuotedString( value: any ): string {

        value = value.toString();
        value = value.replace( /\\/g, '\\\\' );
        value = value.replace( /\x00/g, '\\x00' );
        value = value.replace( /\n/g, '\\n' );
        value = value.replace( /\r/g, '\\r' );
        value = value.replace( /'/g, "''" );

        return "'" + value + "'";
    }
}