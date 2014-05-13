"use strict";

var createDeferred = require( "JQDeferred" );

module.exports = function( func ) {
	return function() {
		var defer = createDeferred();
		var args = [].slice.call( arguments );
		args.push( function( error ) {
			if ( error ) {
				defer.rejectWith( this, [ error ] );
			} else {
				defer.resolveWith( this, [].slice.call( arguments, 1 ) );
			}
		} );
		try {
			func.apply( this, args );
		} catch ( e ) {
			defer.reject( e );
		}
		return defer.promise();
	};
};

module.exports.noerror = function( func ) {
	return function() {
		var defer = createDeferred();
		var args = [].slice.call( arguments );
		args.push( function( first ) {
			defer[ first ? "resolveWith" : "rejectWith" ]( this, arguments );
		} );
		try {
			func.apply( this, args );
		} catch ( e ) {
			defer.reject( e );
		}
		return defer.promise();
	};
};
