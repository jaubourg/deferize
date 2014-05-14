"use strict";

var deferizeMethod = require( "../" ).method;

function AsyncArray() {
	this._array = [];
}

AsyncArray.prototype = {
	push: deferizeMethod( function( value, callback ) {
		if ( this._array.length === 3 ) {
			callback( "too long" );
		} else if ( !value ) {
			callback( "no value" );
		} else {
			var self = this;
			this._lastValue = value;
			setTimeout( function() {
				self._array.push( value );
				callback();
			}, Math.floor( 3 * Math.random() ) );
		}
	} ),
	pop: deferizeMethod.noerror( function( callback ) {
		var self = this;
		setTimeout( function() {
			var value = self._array.pop();
			if ( value ) {
				self._lastValue = value;
			}
			callback( value );
		}, Math.floor( 3 * Math.random() ) );
	} ),
	lastValue: deferizeMethod.sync( function() {
		return this._lastValue;
	}, {
		returnPromise: true
	} ),
	lastValueIfNoError: deferizeMethod.sync( function() {
		return this._lastValue;
	}, {
		rejection: false,
		returnPromise: true
	} ),
	length: deferizeMethod.sync( function() {
		return this._array.length;
	}, {
		returnPromise: true
	} )
};

module.exports = {
	"toy-around": function( __ ) {
		__.expect( 8 );
		var asyncArray = new AsyncArray();
		asyncArray
			.push( "a" )
			.push( false )
			.lastValueIfNoError().fail( function( reason ) {
				__.strictEqual( reason, "no value", "proper reason for first error" );
			} );
		asyncArray
			.lastValue().done( function( value ) {
				__.strictEqual( value, "a", "proper first value" );
			} );
		asyncArray
			.push( "b" )
			.push( "c" )
			.push( "d" )
			.lastValueIfNoError().fail( function( reason ) {
				__.strictEqual( reason, "too long", "proper reason for second error" );
			} );
		asyncArray
			.lastValue().done( function( value ) {
				__.strictEqual( value, "c", "proper last value" );
			} );
		asyncArray
			.pop()
			.length().done( function( length ) {
				__.strictEqual( length, 2, "proper length after first pop" );
			} );
		asyncArray
			.pop()
			.pop()
			.pop()
			.lastValueIfNoError().fail( function( value ) {
				__.strictEqual( arguments.length, 1, "noerror rejection passes arguments" );
				__.strictEqual( value, undefined, "value that provoked rejection is undefined" );
			} );
		asyncArray
			.lastValue().done( function( value ) {
				__.strictEqual( value, "a", "last pop value is first push value" );
				__.done();
			} );
	}
};
