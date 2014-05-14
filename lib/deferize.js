"use strict";

var createDeferred = require( "JQDeferred" );
var slice = [].slice;

function deferizeFactory( callbackFactory ) {
	return function( func ) {
		return function() {
			var defer = createDeferred();
			var args = slice.call( arguments );
			args.push( callbackFactory( defer ) );
			func.apply( this, args );
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
		return createDeferred.when( func.apply( this, arguments ) );
	};
};

module.exports = deferize;
