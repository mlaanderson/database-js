import { describe, it, expect } from 'vitest';
import { parseParameters } from '../src/ParameterObject.js';

// These tests were inspired by https://github.com/mlaanderson/database-js-common
describe( parseParameters.name, () => {

    const testedParamString = 'booleanTrue=true&booleanFalse=false&string=foo&integer=35&float=35.8';


    it( 'should return an empty object for an empty string', () => {
        const result = parseParameters( '' );
        expect( result ).toEqual( {} );
    });

    it( 'should return an empty string when a parameter has no value', () => {
        const result = parseParameters( 'foo=', true );
        expect( result ).toEqual( { foo: '' } );
    });

    describe( 'without detecting types', () => {

        const result = parseParameters( testedParamString );

        it( 'should be string true', () => {
            expect( result.booleanTrue ).toBe( 'true' );
        });

        it( 'should be string false', () => {
            expect( result.booleanFalse ).toBe( 'false' );
        });

        it( 'should be string', () => {
            expect( result.string ).toBe( 'foo' );
        });


        it( 'should be string number', () => {
            expect( result.integer ).toBe( '35' );
        });

        it( 'should be string float', () => {
            expect( result.float ).toBe( '35.8' );
        });

    });


    describe('detecting types', () => {

        const result = parseParameters( testedParamString, true );

        it( 'should be boolean true', () => {
            expect( result.booleanTrue ).toBe( true );
        });

        it( 'should be boolean false', () => {
            expect( result.booleanFalse ).toBe( false );
        });

        it( 'should be string', () => {
            expect( result.string ).toBe( 'foo' );
        });

        it( 'should be integer', () => {
            expect( result.integer ).toBe( 35 );
        });

        it( 'should be float', () => {
            expect( result.float ).toBe( 35.8 );
        });

        it( 'can detect null', () => {
            const result = parseParameters( 'foo=null', true );
            expect( result.foo ).toBeNull();
        } );

    });


    describe('single-level nested objects', () => {

        const testedSingleNestedObjectString = 'subkey[string]=foo&subkey[booleanTrue]=true&subkey[booleanFalse]=false&subkey[integer]=42&subkey[float]=97.1&array[0]=0&array[1]=97.2&array2[]=0&array2[]=97.3';

        const result = parseParameters( testedSingleNestedObjectString, true );


        it( 'subkey should be boolean true', () => {
            expect( result?.subkey?.booleanTrue ).toBe( true );
        });

        it( 'subkey should be boolean false', () => {
            expect( result?.subkey?.booleanFalse ).toBe( false );
        });

        it( 'subkey should be string', () => {
            expect( result?.subkey?.string ).toBe( 'foo' );
        });

        it( 'subkey should be integer', () => {
            expect( result?.subkey.integer ).toBe( 42 );
        });

        it( 'subkey should be float', () => {
            expect( result?.subkey.float ).toBe( 97.1 );
        });

        it( 'should have array subkey', () => {
            expect( Array.isArray( result?.array ) ).toBeTruthy();
        });

        it( 'array length should be 2', () => {
            expect( result?.array?.length ).toBe( 2 );
        });

        it( 'array item should be integer', () => {
            expect( result?.array[0] ).toBe( 0 );
        });

        it( 'array item should be float', () => {
            expect( result?.array[1] ).toBe( 97.2 );
        });

        it( 'should have array2 subkey', () => {
            expect( Array.isArray( result?.array2 ) ).toBeTruthy();
        });

        it( 'array2 length should be 2', () => {
            expect( result?.array2.length ).toBe( 2 );
        });

        it( 'array2 item should be integer', () => {
            expect( result?.array2[0] ).toBe( 0 );
        });

        it( 'array2 item should be float', () => {
            expect( result?.array2[1] ).toBe( 97.3 );
        });
    });


    describe( 'multi-level nested objects', () => {

        const testedMultiNestedObjectString = 'subkey[subkey][string]=foo&subkey[subkey][booleanTrue]=true&subkey[subkey][booleanFalse]=false&subkey[subkey][integer]=42&subkey[subkey][float]=98.1&subkey[subkey][array][]=0&subkey[subkey][array][]=98.2&array[0][0]=0&array[0][1]=98.3&array[1][]=0&array[1][]=98.4';

        const result = parseParameters( testedMultiNestedObjectString, true );

        it( 'should have object subkey object subkey', () => {
            expect( typeof result?.subkey.subkey ).toBe( 'object' );
        });

        it( 'subkey should be boolean true', () => {
            expect( result?.subkey?.subkey?.booleanTrue ).toBe( true );
        });

        it( 'subkey should be boolean false', () => {
            expect( result?.subkey?.subkey?.booleanFalse ).toBe( false );
        });

        it( 'subkey should be string', () => {
            expect( result?.subkey?.subkey?.string ).toBe( 'foo' );
        });

        it( 'subkey should be integer', () => {
            expect( result?.subkey?.subkey?.integer ).toBe( 42 );
        });

        it( 'subkey should be float', () => {
            expect( result?.subkey?.subkey?.float ).toBe( 98.1 );
        });

        it( 'subkey should be array', () => {
            expect( Array.isArray( result?.subkey?.subkey?.array ) ).toBeTruthy();
        });
    });

});