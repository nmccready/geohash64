/**
 *  geohash64
 *
 * @version: 1.0.1
 * @author: Nicholas McCready
 * @date: Fri Jul 25 2014 12:04:24 GMT-0400 (EDT)
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
describe('geohash64', function() {
  after(function() {
    var art;
    art = "                    .__                  .__      ________   _____\n  ____   ____  ____ |  |__ _____    _____|  |__  /  _____/  /  |  |\n / ___\\_/ __ \\/  _ \\|  |  \\\\__  \\  /  ___/  |  \\/   __  \\  /   |  |_\n/ /_/  >  ___(  <_> )   Y  \\/ __ \\_\\___ \\|   Y  \\  |__\\  \\/    ^   /\n\\___  / \\___  >____/|___|  (____  /____  >___|  /\\_____  /\\____   |\n/_____/     \\/           \\/     \\/     \\/     \\/       \\/      |__|\n";
    console.log(art);
    return console.log("\nname:" + geohash64.name + ", version: " + geohash64.version);
  });
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
  return describe('GoogleLatLon', function() {
    var fullHash, manyHashes, manyPoints, zoomHashes, zoomLevels;
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
    describe('GoogleHash64', function() {
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
    zoomLevels = [174, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    zoomHashes = ['mD', '?', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];
    return describe('zoomLevel', function() {
      describe('GoogleCoder', function() {
        describe('encode', function() {
          describe('single value coord - (floating lat or lon +/-)', function() {
            return it(manyPoints[1][1], function() {
              return geohash64.GoogleCoder.encode(manyPoints[1][1]).should.be.equal('`~oia@');
            });
          });
          return describe('zoomLevels', function() {
            return zoomLevels.forEach(function(l, i) {
              return it(l, function() {
                return geohash64.GoogleCoder.encode(l, true).should.be.equal(zoomHashes[i]);
              });
            });
          });
        });
        return describe('decode', function() {
          describe('decode single coord - (floating lat or lon +/-)', function() {
            return it(manyPoints[1][1], function() {
              var isSingle, isZoom;
              return geohash64.GoogleCoder.decode('`~oia@', isZoom = false, isSingle = true).should.be.equal(manyPoints[1][1]);
            });
          });
          return describe('zoomeHashes', function() {
            return zoomHashes.forEach(function(h, i) {
              return it(h, function() {
                var isSingle, isZoom;
                return geohash64.GoogleCoder.decode(h, isZoom = true, isSingle = true).should.be.equal(zoomLevels[i]);
              });
            });
          });
        });
      });
      return describe('geohash64 encodeZoom/decodeZoom Interfaces', function() {
        describe('geohash64.decodeZoom', function() {
          return describe('zoomLevels', function() {
            return zoomLevels.forEach(function(l, i) {
              return it(l, function() {
                return geohash64.encodeZoom(l).should.be.equal(zoomHashes[i]);
              });
            });
          });
        });
        return describe('geohash64.decodeZoom', function() {
          return describe('zoomHashes', function() {
            return zoomHashes.forEach(function(h, i) {
              return it(h, function() {
                return geohash64.decodeZoom(h).should.be.equal(zoomLevels[i]);
              });
            });
          });
        });
      });
    });
  });
});


/*
  Fix these specs later for other base64 algo
 */
