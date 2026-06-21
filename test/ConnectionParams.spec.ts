import { describe, it, expect } from 'vitest';
import { ConnectionParams } from '../src/ConnectionParams.js';

describe( ConnectionParams.name, () => {


    describe( '#fromString', () => {

        describe( 'path-based', () => {

            it( 'can be created from a full path-based string', () => {
                const cp = ConnectionParams.fromString( 'sql://C:\\foo\\bar.db?one=1&two=2' );
                expect( cp ).not.toBeNull();
                expect( cp?.driverName ).toBe( 'sql' );
                expect( cp?.database ).toBe( 'C:\\foo\\bar.db' );
                expect( cp?.parameters ).toBe( '?one=1&two=2' );
            } );

            it( 'returns null when the driver name is not given', () => {
                const cp = ConnectionParams.fromString( '://?one=1&two=2' );
                expect( cp ).toBeNull();
            } );

            it( 'returns null when the path is not given', () => {
                const cp = ConnectionParams.fromString( 'sql://?one=1&two=2' );
                expect( cp ).toBeNull();
            } );

        } );

        describe( 'URL-based', () => {

            it( 'can be created from a full url-based string', () => {
                const cp = ConnectionParams.fromString( 'mysql://user123:password456@localhost:1234/acmedb?one=1&two=2' );
                expect( cp ).not.toBeNull();
                expect( cp?.driverName ).toBe( 'mysql' );
                expect( cp?.username ).toBe( 'user123' );
                expect( cp?.password ).toBe( 'password456' );
                expect( cp?.hostname ).toBe( 'localhost' );
                expect( cp?.port ).toBe( 1234 );
                expect( cp?.database ).toBe( 'acmedb' );
                expect( cp?.parameters ).toBe( '?one=1&two=2' );
            } );

            it( 'returns null when the driver name is not given', () => {
                const cp = ConnectionParams.fromString( '://user123:password456@localhost:1234/acmedb?one=1&two=2' );
                expect( cp ).toBeNull();
            } );

            it( 'returns null when the database is not given', () => {
                const cp = ConnectionParams.fromString( 'mysql://user123:password456@localhost:1234?one=1&two=2' );
                expect( cp ).toBeNull();
            } );

            it( 'returns null when the username is not given', () => {
                const cp = ConnectionParams.fromString( 'mysql://:password456@localhost:1234/acmedb?one=1&two=2' );
                expect( cp ).toBeNull();
            } );

            it( 'returns null when the hostname is not given', () => {
                const cp = ConnectionParams.fromString( 'mysql://:password456@:1234/acmedb?one=1&two=2' );
                expect( cp ).toBeNull();
            } );

        } );

    } );


    describe( '#toURL', () => {

        it( 'can convert a path-based connection without parameters', () => {
            const cp = new ConnectionParams( { driverName: 'sqlite', database: 'acme.db' } );
            const result = cp.toURL();
            expect( result ).toBe( 'sqlite://acme.db' );
        } );

        it( 'can convert a path-based connection with parameters', () => {
            const cp = new ConnectionParams( { driverName: 'sqlite', database: 'acme.db', parameters: '?foo=1&bar=2' } );
            const result = cp.toURL();
            expect( result ).toBe( 'sqlite://acme.db?foo=1&bar=2' );
        } );

        it( 'can convert a URL-based connection without parameters', () => {
            const cp = new ConnectionParams( { driverName: 'mysql', database: 'acmedb', parameters: undefined, username: 'bob', password: '123', hostname: 'localhost', port: 3306 } );
            const result = cp.toURL();
            expect( result ).toBe( 'mysql://bob:123@localhost:3306/acmedb' );
        } );

        it( 'can convert a URL-based connection without parameters', () => {
            const cp = new ConnectionParams( { driverName: 'mysql', database: 'acmedb', parameters: '?foo=1&bar=2', username: 'bob', password: '123', hostname: 'localhost', port: 3306 } );
            const result = cp.toURL();
            expect( result ).toBe( 'mysql://bob:123@localhost:3306/acmedb?foo=1&bar=2' );
        } );

    } );


} );