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

function internalSync( func, self, args ) {
	return createDeferred.when( func.apply( self, args ) );
}

function deferizeFactory( internal ) {
	return function( func ) {
		return function() {
			return internal( func, this, arguments );
		};
	};
}

function deferizeMethodFactory( internal ) {
	function pipeCallback( func, self, args ) {
		return func && function() {
			return internal( func, self, args );
		};
	}
	return function( func, options ) {
		options = options || {};
		var promiseField = "_promise" + ( options.type ? ( "_" + options.type ) : "" );
		return function() {
			if ( !this[ promiseField ] ) {
				this[ promiseField ] = internal( func, this, arguments );
			} else {
				this[ promiseField ] = this[ promiseField ].pipe(
					pipeCallback( options.resolution !== false && func, this, arguments ),
					pipeCallback( options.rejection !== false && func, this, arguments )
				);
			}
			return options && options.returnPromise ? this[ promiseField ] : this;
		};
	};
}

// Create and Export

var deferize;

deferize = deferizeFactory( internalDefault );
deferize.noerror = deferizeFactory( internalNoError );
deferize.sync = deferizeFactory( internalSync );
deferize.method = deferizeMethodFactory( internalDefault );
deferize.method.noerror = deferizeMethodFactory( internalNoError );
deferize.method.sync = deferizeMethodFactory( internalSync );

module.exports = deferize;
