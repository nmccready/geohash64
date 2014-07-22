/**
 *  geodecoder64js
 *
 * @version: 0.0.0
 * @author: Nicholas McCready
 * @date: Tue Jul 22 2014 18:35:12 GMT-0400 (EDT)
 * @license: MIT
 */
isNode =
  !(typeof window !== "undefined" && window !== null);


(function() {
  var base64, bigint, ns2, project, should, _;

  if (isNode) {
    ns2 = require('ns2');
    should = require('should');
    _ = require('lodash');
    bigint = require('bigint');
    base64 = require('base-64');
    project = require('./index');
  }

  describe('sanity', function() {
    it('should.js exist', function() {
      if (!should) {
        throw new Error();
      }
    });
    it('lodash exists', function() {
      if (!_) {
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
      if (!project) {
        throw new Error('THIS MAIN PROJECT IS NOT LOADED!');
      }
    });
  });

}).call(this);


/*
ported from @a_dat's geohash64Test.py
MIT license.
 */

(function() {
  describe('LatLon', function() {
    it('can be created', function() {
      var ll;
      ll = new geohash64.LatLon(35.4, 135.5);
      ll.lat.should.be.eql(35.4);
      return ll.lon.should.be.eql(135.5);
    });
    return it('should throw range error', function() {
      return new geohash64.LatLon(110, 135).should.throwError;
    });
  });

}).call(this);
