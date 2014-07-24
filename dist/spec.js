/**
 *  geohash64js
 *
 * @version: 1.0.0
 * @author: Nicholas McCready
 * @date: Thu Jul 24 2014 17:00:55 GMT-0400 (EDT)
 * @license: MIT
 */
isNode =
  !(typeof window !== "undefined" && window !== null);


var geohash64, ns2, should, _;

if (isNode) {
  ns2 = require('ns2');
  should = require('should');
  _ = require('lodash');
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
  var fullHash, manyHashes, manyPoints;
  manyPoints = [[38.5, -120.2], [45, -179.98321], [40.7, -120.95], [43.252, -126.453]];
  manyHashes = ['_p~iF~ps|U', '_atqG`~oia@', '_flwFn`faV', '_t~fGfzxbW'];
  fullHash = manyHashes.reduce(function(prev, current) {
    return prev + current;
  });
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
  describe('encode', function() {
    describe('via LatLon Object', function() {
      return describe('known google hashes', function() {
        return manyPoints.forEach(function(point, i) {
          return it(point, function() {
            return ((function(func, args, ctor) {
              ctor.prototype = func.prototype;
              var child = new ctor, result = func.apply(child, args);
              return Object(result) === result ? result : child;
            })(geohash64.GoogleLatLon, point, function(){})).getGeoHash().hash.should.be.eql(manyHashes[i]);
          });
        });
      });
    });
    return describe('via encode method', function() {
      return it(manyPoints, function() {
        return geohash64.encode(manyPoints).should.eql(fullHash);
      });
    });
  });
  return describe('decode', function() {
    describe('known google hashes', function() {
      return manyPoints.forEach(function(point, i) {
        return it(point, function() {
          return new geohash64.GoogleHash64(manyHashes[i]).center_ll.toEqual((function(func, args, ctor) {
            ctor.prototype = func.prototype;
            var child = new ctor, result = func.apply(child, args);
            return Object(result) === result ? result : child;
          })(geohash64.GoogleLatLon, point, function(){})).should.be.ok;
        });
      });
    });
    return describe('via decode method', function() {
      return it("" + fullHash + " to " + manyPoints, function() {
        return geohash64.decode(fullHash, true).should.eql(manyPoints);
      });
    });
  });
});
