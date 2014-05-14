"use strict";

var createDeferred = require( "JQDeferred" );
var slice = [].slice;

function internalDeferize( callbackFactory ) {
	return function( func, self, args ) {
		var defer = createDeferred();
		args = slice.call( args );
		args.push( callbackFactory( defer ) );
		func.apply( self, args );
		return defer.promise();
	};
}

function deferizeFactory( internal ) {
	return function( func ) {
		return function() {
			return internal( func, this, arguments );
		};
	};
}

var internalDefault = internalDeferize( function( defer ) {
	return function( error ) {
		if ( error ) {
			defer.rejectWith( this, arguments );
		} else {
			defer.resolveWith( this, slice.call( arguments, 1 ) );
		}
	};
} );

var internalNoError = internalDeferize( function( defer ) {
	return function( first ) {
		( first ? defer.resolveWith : defer.rejectWith )( this, arguments );
	};
} );

var deferize = deferizeFactory( internalDefault );

deferize.noerror = deferizeFactory( internalNoError );

deferize.sync = function( func ) {
	return function() {
		return createDeferred.when( func.apply( this, arguments ) );
	};
};

module.exports = deferize;
