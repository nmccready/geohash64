geodecoder64js
==============

Project is attempt of porting [python-geohash64](https://code.google.com/p/python-geohash64/source/browse/trunk/geohash64.py) base64 geo encodings to nodejs.


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
