geodecoder64js
==============

Project is attempt of porting [Jefferey Sambells](http://jeffreysambells.com/2010/05/27/decoding-polylines-from-google-maps-direction-api-with-java) Java code for decoding google base264 geo encodings to nodejs.


*Dependencies*
- [bigint](https://github.com/substack/node-bigint)

install
=======

You'll need the libgmp source to compile this package. Under Debian-based systems,

    sudo aptitude install libgmp3-dev

On a Mac with [Homebrew](https://github.com/mxcl/homebrew/),

    brew install gmp

And then install with [npm](http://npmjs.org):

    npm install
