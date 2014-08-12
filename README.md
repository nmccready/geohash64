geohash64
==============
[![Dependencies](https://david-dm.org/nmccready/geohash64.png)](https://david-dm.org/nmccready/geohash64)&nbsp;
[![Dependencies](https://david-dm.org/nmccready/geohash64.png)](https://david-dm.org/nmccready/geohash64)&nbsp;
[![Build Status](https://travis-ci.org/nmccready/geohash64.png?branch=r1-dev)](https://travis-ci.org/nmccready/geohash64)

Project is attempt of porting:
 - google maps base64:
  - [google algorithm](https://developers.google.com/maps/documentation/utilities/polylinealgorithm)
  - [Nathan Villaescusa's, ptyhon code](https://gist.github.com/signed0/2031157)


 - [python-geohash64](https://code.google.com/p/python-geohash64/source/browse/trunk/geohash64.py) base64 geo encodings to nodejs. (**eventually**)

install
=======

And then install with [npm](http://npmjs.org):

    npm install

use
===
Overall you should refer to the specs..

But to enlighten everyone here are some specs copied here:

    geohash64 = require 'geohash64'
    manyHashes = ['_p~iF~ps|U', '_atqG`~oia@', '_flwFn`faV', '_t~fGfzxbW']
    fullHash = manyHashes.reduce((prev, current) ->
      prev + current)

    #fullHash should be '_p~iF~ps|U_atqG`~oia@_flwFn`faV_t~fGfzxbW'
    test1 = geohash64.encode(manyPoints) == fullHash

    test2 = _.Equal(geohash64.decode(fullHash,true), manyPoints)

    throw new Error('Hashes are not what expected!') unless (test1 and test2)
