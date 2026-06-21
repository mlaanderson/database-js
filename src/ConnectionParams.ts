import { ParameterObject, parseParameters } from "./ParameterObject.js";

export type ConnectionObject = {
    driverName: string,
    database: string,
    parameters?: string,
    username?: string,
    password?: string,
    hostname?: string,
    port?: string|number,
};


export class ConnectionParams {

    private readonly obj: ConnectionObject;
    public readonly parametersObject: ParameterObject;

    constructor(
        obj: ConnectionObject,
        detectParametersTypes: boolean = false,
    ) {
        this.obj = { ...obj, port: typeof obj.port == 'string' ? Number( obj.port ) : obj.port };
        this.parametersObject = parseParameters( obj.parameters || '', detectParametersTypes );
    }

    get driverName(): string { return this.obj.driverName; }
    get database(): string { return this.obj.database; }
    get parameters(): string|undefined { return this.obj.parameters; }
    get username(): string|undefined { return this.obj.username; }
    get password(): string|undefined { return this.obj.password; }
    get hostname(): string|undefined { return this.obj.hostname; }
    get port(): string|number|undefined { return this.obj.port; }


    static fromString( connectionString: string, detectParametersTypes: boolean = false ): ConnectionParams|null {

        // First syntax:
        // driverName://username:password@host:port/database?param1=value1&param2=value2
        //  - Optional: password, port, parameters
        //
        // Second syntax:
        // driverName:path?param1=value1&param2=value2
        // - Optional: parameters

        const urlSyntax = /^(?<driverName>[a-z][a-z0-9]+)\:\/\/(?<username>[a-zA-z][a-zA-z0-9_.-]+)(\:(?<password>[^@]+))?@(?<hostname>[a-zA-z0-9_.-]+)(\:(?<port>[0-9]+))?\/(?<database>[a-zA-z0-9_.-]+)(?<parameters>\?[^?]+)?/;
        let result =  urlSyntax.exec( connectionString );

        if ( ! result && ! connectionString.includes( '@' ) ) {

            const pathSyntax = /^(?<driverName>[a-z][a-z0-9]+)\:\/\/(?<database>[^?]+)(?<parameters>\?[^?]+)?/;
            result = pathSyntax.exec( connectionString );

            if ( ! result || ! result.groups ) {
                return null;
            }
            const { driverName, database, parameters } = result.groups;

            return new ConnectionParams( { driverName, database, parameters } );
        }

        if ( ! result || ! result.groups ) {
            return null;
        }

        return new ConnectionParams( result.groups as ConnectionObject, detectParametersTypes );
    }


    public toURL(): string {
        return this.driverName + '://' +
            ( this.username ? this.username : '' ) +
            ( this.password ? ':' + this.password : '' ) +
            ( this.hostname ? '@' + this.hostname : '' ) +
            ( this.port ? ':' + this.port : '' ) +
            ( this.hostname ? '/' : '' ) + this.database +
            // this.getParametersAsString()
            ( this.parameters || '' )
            ;
    }

}
