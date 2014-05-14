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
	lastValue: deferizeMethod.getter( "_lastValue" ),
	length: deferizeMethod.sync( function( callback ) {
		callback( this._array.length );
	} ),
	onError: deferizeMethod.fail()
};

module.exports = {
	"toy-around": function( __ ) {
		__.expect( 8 );
		var asyncArray = new AsyncArray();
		asyncArray
			.push( "a" )
			.push( false )
			.onError( function( reason ) {
				__.strictEqual( reason, "no value", "proper reason for first error" );
			} )
			.lastValue( function( value ) {
				__.strictEqual( value, "a", "proper first value" );
			} )
			.push( "b" )
			.push( "c" )
			.push( "d" )
			.onError( function( reason ) {
				__.strictEqual( reason, "too long", "proper reason for second error" );
			} )
			.lastValue( function( value ) {
				__.strictEqual( value, "c", "proper last value" );
			} )
			.pop()
			.length( function( length ) {
				__.strictEqual( length, 2, "proper length after first pop" );
			} )
			.pop()
			.pop()
			.pop()
			.onError( function( value ) {
				__.strictEqual( arguments.length, 1, "noerror rejection passes arguments" );
				__.strictEqual( value, undefined, "value that provoked rejection is undefined" );
			} )
			.lastValue( function( value ) {
				__.strictEqual( value, "a", "last pop value is first push value" );
				__.done();
			} );
	}
};
