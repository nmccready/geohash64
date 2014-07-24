/**
 *  geodecoder64js
 *
 * @version: 0.0.0
 * @author: Nicholas McCready
 * @date: Thu Jul 24 2014 12:02:18 GMT-0400 (EDT)
 * @license: MIT
 */
isNode =
  !(typeof window !== "undefined" && window !== null);


var base64, bigint, geohash64, ns2, should, _;

if (isNode) {
  ns2 = require('ns2');
  should = require('should');
  _ = require('lodash');
  bigint = require('bigint');
  base64 = require('base-64');
  geohash64 = require('./index');
}

describe('sanity', function() {
  it('should.js exist', function() {
    if (!should) {
      throw new Error();
    }
  });
  it('lodash exists', function() {
    if (_ == null) {
      throw new Error('lodash or underscore undefined');
    }
  });
  it('ns2 is loaded', function() {
    if (!ns2) {
      throw new Error('ns2 is missing');
    }
  });
  it('bigint is loaded', function() {
    if (!bigint) {
      throw new Error('ns2 is missing');
    }
  });
  it('base64 is loaded', function() {
    if (!base64) {
      throw new Error('ns2 is missing');
    }
  });
  return it('this project is loaded', function() {
    if (!geohash64) {
      throw new Error('THIS MAIN PROJECT IS NOT LOADED!');
    }
  });
});


/*
ported from @a_dat's geohash64Test.py
MIT license.
 */
describe('LatLon', function() {
  it('can be created', function() {
    var ll;
    ll = new geohash64.LatLon(35.4, 135.5);
    ll.lat.should.be.eql(35.4);
    return ll.lon.should.be.eql(135.5);
  });
  return it('should throw range error', function() {
    (function() {
      return new geohash64.LatLon(110, 135);
    }).should["throw"]();
    return (function() {
      return new geohash64.LatLon(45.1, -190);
    }).should["throw"]();
  });
});

describe('GoogleLatLon', function() {
  it('can be created', function() {
    var ll;
    ll = new geohash64.GoogleLatLon(35.4, 135.5);
    ll.lat.should.be.eql(35.4);
    return ll.lon.should.be.eql(135.5);
  });
  it('should throw range error', function() {
    (function() {
      return new geohash64.LatLon(110, 135);
    }).should["throw"]();
    return (function() {
      return new geohash64.LatLon(45.1, -190);
    }).should["throw"]();
  });
  return it('should parse known google hashes', function() {
    (new geohash64.GoogleLatLon(38.5, -120.2)).getGeoHash().should.be.eql('_p~iF~ps|U');
    return (new geohash64.GoogleLatLon(45, -179.98321)).getGeoHash().should.be.eql('_atqG`~oia@');
  });
});
