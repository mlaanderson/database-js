
export interface Transactionable {

    /**
     * Indicates if transactions are supported.
     *
     * @returns {boolean}
     */
    isTransactionSupported(): boolean;

    /**
     * Indicates if it is in a transaction.
     *
     * @returns {boolean}
     */
    inTransaction(): boolean;

    /**
     * Begins a transaction. Returns true if successful, false if transactions are not supported or a transaction already exists.
     *
     * @returns {boolean}
     */
    beginTransaction(): Promise< boolean >;

    /**
     * Commits a transaction. Returns true if successful, false if transactions are not supported or a transaction was not started.
     *
     * @returns {boolean}
     */
    commit(): Promise< boolean >;

    /**
     * Rolls a transaction back. Returns true if successful, false if transactions are not supported or a transaction was not started.
     *
     * @returns {boolean}
     */
    rollback(): Promise< boolean >;

}
