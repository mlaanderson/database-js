
export interface BaseStatement {

    /**
     * Executes a SQL query.
     *
     * @param {string} sql SQL query.
     * @param {any[]} params Query parameters.
     * @returns
     */
    query( sql: string, ...params: any ): Promise< any >;

    /**
     * Executes a SQL command.
     *
     * @param {string} sql SQL command.
     * @param {any[]} params Command parameters.
     * @returns
     */
    execute( sql: string, ...params: any ): Promise< any >;

}