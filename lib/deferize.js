"use strict";

var createDeferred = require( "JQDeferred" );
var slice = [].slice;

function deferizeFactory( callbackFactory ) {
	return function( func ) {
		return function() {
			var defer = createDeferred();
			var args = slice.call( arguments );
			args.push( callbackFactory( defer ) );
			try {
				func.apply( this, args );
			} catch ( e ) {
				defer.rejectWith( this, [ e ] );
			}
			return defer.promise();
		};
	};
}

var deferize = deferizeFactory( function( defer ) {
	return function( error ) {
		if ( error ) {
			defer.rejectWith( this, arguments );
		} else {
			defer.resolveWith( this, slice.call( arguments, 1 ) );
		}
	};
} );

deferize.noerror = deferizeFactory( function( defer ) {
	return function( first ) {
		( first ? defer.resolveWith : defer.rejectWith )( this, arguments );
	};
} );

deferize.sync = function( func ) {
	return function() {
		var result;
		var defer;
		try {
			defer = createDeferred.when( func.apply( this, arguments ) );
		} catch ( e ) {
			defer = createDeferred().reject( e );
		}
		return defer.promise();
	};
};

module.exports = deferize;
