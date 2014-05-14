"use strict";

var deferize = require( "../" );

var existingFile = __filename;
var nonExistingFile = __filename + ".nope";

var fs = require( "fs" );

var stat = deferize( fs.stat );
var exists = deferize.noerror( fs.exists );
var divide = deferize.sync( function( a, b ) {
	return a / b;
} );

function iThrow() {
	throw "an exception";
}

module.exports = {
	success: function( __ ) {
		__.expect( 1 );
		stat( existingFile ).done( function( stat ) {
			__.ok( stat instanceof fs.Stats, "stat object" );
		} ).always( function() {
			__.done();
		} );
	},
	error: function( __ ) {
		__.expect( 1 );
		stat( nonExistingFile ).fail( function( error ) {
			__.ok( !!error, "error object" );
		} ).always( function() {
			__.done();
		} );
	},
	exception: function( __ ) {
		__.expect( 1 );
		try {
			deferize( iThrow )();
		} catch ( error ) {
			__.strictEqual( error, "an exception", "exception caught" );
			__.done();
		}
	},
	"<noerror> success": function( __ ) {
		__.expect( 1 );
		exists( existingFile ).done( function( flag ) {
			__.strictEqual( flag, true, "flag is true" );
		} ).always( function() {
			__.done();
		} );
	},
	"<noerror> false": function( __ ) {
		__.expect( 1 );
		exists( nonExistingFile ).fail( function( flag ) {
			__.strictEqual( flag, false, "flag is false" );
		} ).always( function() {
			__.done();
		} );
	},
	"<noerror> exception": function( __ ) {
		__.expect( 1 );
		try {
			deferize.noerror( iThrow )();
		} catch ( error ) {
			__.strictEqual( error, "an exception", "exception caught" );
			__.done();
		}
	},
	"<sync> success": function( __ ) {
		__.expect( 1 );
		divide( 50, 5 ).done( function( result ) {
			__.strictEqual( result, 10, "result is 10" );
		} ).always( function() {
			__.done();
		} );
	},
	"<sync> exception": function( __ ) {
		__.expect( 1 );
		try {
			deferize.sync( iThrow )();
		} catch ( error ) {
			__.strictEqual( error, "an exception", "exception caught" );
			__.done();
		}
	}
};
