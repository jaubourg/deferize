[![Build Status](https://travis-ci.org/jaubourg/deferize.svg?branch=master)](https://travis-ci.org/jaubourg/deferize)
[![Coverage Status](https://img.shields.io/coveralls/jaubourg/deferize.svg)](https://coveralls.io/r/jaubourg/deferize)
[![Dependency Status](https://david-dm.org/jaubourg/deferize.svg)](https://david-dm.org/jaubourg/deferize)
[![devDependency Status](https://david-dm.org/jaubourg/deferize/dev-status.svg)](https://david-dm.org/jaubourg/deferize#info=devDependencies)
[![Gittip](https://img.shields.io/gittip/jaubourg.svg)](https://www.gittip.com/jaubourg/)

[![NPM](https://nodei.co/npm/deferize.png?downloads=true&stars=true)](https://www.npmjs.org/package/deferize)
# deferize

`deferize` will turn any nodish callback-based function into a jQuery Promise.

It seems I always need something like this in my projects as of late so I figured others probably do too and I decided to extract it into its own tiny module.

## Install

`npm install deferize --save`

## Usage

The most basic use of `deferize` is by feeding it a function.

```javascript
var fs = require( "fs" );
var open = deferize( fs.open );
```

What you get is a new function that is no longer callback-based but returns a promise instead.

For instance, you'd use the previous example as follows:

```javascript
open( "path/to/my/file", "r" ).done( function( fd ) {
	// we have the file descriptor
} ).fail( function( error ) {
	// something went wrong
} );
```

### No error argument

Sometimes a callback doesn't get an error as its first argument. In that case, you should call `deferize.noerror`:

```javascript
var fs = require( "fs" );
var exists = deferize.noerror( fs.exists );
```

The underlying promise will be resolved if the first argument is trueish and rejected otherwise:

```javascript
exists( "path/to/my/file" ).done( function( flag ) {
	// file does exist, flag === true
} ).fail( function( flag ) {
	// file does not exist, flag === false
} );
```

## License

Copyright (c) 2012 - 2014 [Julian Aubourg](mailto:j@ubourg.net)
Licensed under the [MIT license](https://raw.githubusercontent.com/jaubourg/deferize/master/LICENSE-MIT).
