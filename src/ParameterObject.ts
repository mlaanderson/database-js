
export type ParameterObject = {
    [key: string]: any;
};


export function parseParameters( parameters: string, detectTypes: boolean = false ): ParameterObject {

    let obj: ParameterObject = {};

    const allParameters: string[] = parameters.startsWith( '?' )
        ? parameters.substring( 1 ).split( '&' )
        : parameters.split( '&' );

    for ( const param of allParameters ) {
        parseSingleParameter( obj, param, detectTypes );
    }

    return obj;
}


/**
 * Parses a single parameter and includes the detected properties in the given object.
 *
 * @param {ParameterObject} obj Object to include the properties.
 * @param {string} param Parameter
 * @param {boolean} [detectTypes=false] Flag to detect value types.
 */
function parseSingleParameter( obj: ParameterObject, param: string, detectTypes: boolean = false ): void {

    const [ key, value ] = param.split( '=' );

    const squareBracketIndex = key.indexOf( '[' );
    if ( squareBracketIndex < 0 ) {
        obj[ key ] = detectTypes ? parseValue( value ) : value;
        return;
    }

    const realKey = key.substring( 0, squareBracketIndex );
    if ( ! obj[ realKey ] ) {
        obj[ realKey ] = undefined;
    }

    let currentKey: string|number = realKey;
    let current = obj;
    let currentIndex = squareBracketIndex + 1;

    const keyLength = key.length;

    do {

        // console.log( 'Cur', current, 'Key', currentKey, 'Idx', currentIndex );
        // console.log( 'CHAR', key[ currentIndex ] );

        let content = '';
        while ( currentIndex < keyLength && key[ currentIndex ] != ']' ) { // Stop on ']'
            content += key[ currentIndex ];
            currentIndex++;
        }

        // console.log( 'CONTENT', content );

        if ( content == '' ) { // So the last content was "["

            let newValue: ParameterObject = [];
            if ( ! current[ currentKey ] ) {
                current[ currentKey ] = newValue;
            } else {
                newValue = current[ currentKey ];
            }
            current = newValue;
            currentKey = newValue.length; // Next element

        } else if ( ! isNaN( Number( content ) ) ) { // Numeric index

            const index = Number( content );

            let newValue: ParameterObject = [];
            if ( ! current[ currentKey ] ) {
                current[ currentKey ] = newValue;
            } else {
                newValue = current[ currentKey ];
            }
            current = newValue;
            currentKey = index;

        } else { // Object

            let newValue: ParameterObject = {};
            newValue[ content ] = undefined;

            if ( ! current[ currentKey ] ) {
                current[ currentKey ] = newValue;
            } else {
                newValue = current[ currentKey ];
            }

            currentKey = content;
            current = newValue;
        }

        // Set the value when it is the last index
        if ( currentIndex >= keyLength - 1 ) {
            current[ currentKey ] = detectTypes ? parseValue( value ) : value;
            break;
        }

        currentIndex++;

        if ( currentIndex < keyLength && key[ currentIndex ] == '[' ) {
            currentIndex++;
        }

    } while ( currentIndex < keyLength );

}


function parseValue( value: string ): string|number|boolean|null {

    if ( value == '' ) {
        return '';
    }

    const lowerCasedValue = value.toLowerCase();

    if ( lowerCasedValue == 'true' ) {
        return true;
    } else if ( lowerCasedValue == 'false' ) {
        return false;
    } else if ( lowerCasedValue == 'null' ) {
        return null;
    // } else if ( /^[-+]?(\d+\.)?\d+(E[-+]?\d+)?$/i.test( value ) ) {
    } else if ( ! isNaN( Number( value ) ) ) {
        return Number( value );
    }

    return value;
}
