"use strict";

var deferize = require( "../" );

var existingFile = __filename;
var nonExistingFile = __filename + ".nope";

var fs = require( "fs" );

var stat = deferize( fs.stat );
var exists = deferize.noerror( fs.exists );

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
		deferize( iThrow )().fail( function( error ) {
			__.strictEqual( error, "an exception", "exception caught" );
		} ).always( function() {
			__.done();
		} );
	},
	"<noerror> success": function( __ ) {
		__.expect( 1 );
		exists( existingFile ).done( function( flag ) {
			__.strictEqual( flag, true, "flag is true" );
		} ).always( function() {
			__.done();
		} );
	},
	"<noerror> error": function( __ ) {
		__.expect( 1 );
		exists( nonExistingFile ).fail( function( flag ) {
			__.strictEqual( flag, false, "flag is false" );
		} ).always( function() {
			__.done();
		} );
	},
	"<noerror> exception": function( __ ) {
		__.expect( 1 );
		deferize.noerror( iThrow )().fail( function( error ) {
			__.strictEqual( error, "an exception", "exception caught" );
		} ).always( function() {
			__.done();
		} );
	}
};
