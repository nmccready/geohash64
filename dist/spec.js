/**
 *  geohash64
 *
 * @version: 1.0.2
 * @author: Nicholas McCready
 * @date: Mon Sep 22 2014 20:25:27 GMT-0400 (EDT)
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
    var art, crap;
    crap = '';
    art = "" + crap + "\n                    .__                  .__      ________   _____\n  ____   ____  ____ |  |__ _____    _____|  |__  /  _____/  /  |  |\n / ___\\_/ __ \\/  _ \\|  |  \\\\__  \\  /  ___/  |  \\/   __  \\  /   |  |_\n/ /_/  >  ___(  <_> )   Y  \\/ __ \\_\\___ \\|   Y  \\  |__\\  \\/    ^   /\n\\___  / \\___  >____/|___|  (____  /____  >___|  /\\_____  /\\____   |\n/_____/     \\/           \\/     \\/     \\/     \\/       \\/      |__|";
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
    var fullHash, googlesAnswer, googlesFullHash, googlesPoints, manyHashes, manyPoints, zoomHashes, zoomLevels;
    describe('can create', function() {
      it('normal lat lon args', function() {
        var ll;
        ll = new geohash64.GoogleLatLon(35.4, 135.5);
        ll.lat.should.be.eql(35.4);
        return ll.lon.should.be.eql(135.5);
      });
      it('array arg1', function() {
        var ll;
        ll = new geohash64.GoogleLatLon([35.4, 135.5]);
        ll.lat.should.be.eql(35.4);
        return ll.lon.should.be.eql(135.5);
      });
      it('array arg2', function() {
        var ll;
        ll = new geohash64.GoogleLatLon([35.4, 135.5], [36.4, 136.5]);
        ll.lat.should.be.eql(35.4);
        ll.lon.should.be.eql(135.5);
        ll.from.lat.should.be.eql(36.4);
        ll.from.lon.should.be.eql(136.5);
        ll.magnitude.lat.should.be.eql(-1);
        return ll.magnitude.lon.should.be.eql(-1);
      });
      it('mismatch should throw num, array', function() {
        var fn;
        fn = function() {
          return new geohash64.GoogleLatLon(5, [35.4, 135.5]);
        };
        return fn.should["throw"]();
      });
      it('mismatch should throw array, num', function() {
        var fn;
        fn = function() {
          return new geohash64.GoogleLatLon([35.4, 135.5], 5);
        };
        return fn.should["throw"]();
      });
      it('undefined array on arg1 (undefined,array)', function() {
        var fn;
        fn = function() {
          return new geohash64.GoogleLatLon(void 0, [35.4, 135.5]);
        };
        return fn.should["throw"]();
      });
      it('either undefined (number, undefined)', function() {
        var fn;
        fn = function() {
          return new geohash64.GoogleLatLon(35.4, void 0);
        };
        return fn.should["throw"]();
      });
      return it('either undefined (undefined,number)', function() {
        var fn;
        fn = function() {
          return new geohash64.GoogleLatLon(void 0, 5);
        };
        return fn.should["throw"]();
      });
    });
    it('should throw range error', function() {
      (function() {
        return new geohash64.LatLon(110, 135);
      }).should["throw"]();
      return (function() {
        return new geohash64.LatLon(45.1, -190);
      }).should["throw"]();
    });
    manyPoints = [[45, -179.98321]];
    googlesPoints = [[38.5, -120.2], [40.7, -120.95], [43.252, -126.453]];
    manyPoints = manyPoints.concat(googlesPoints);
    manyHashes = ['_atqG`~oia@', '_p~iF~ps|U', '_flwFn`faV', '_t~fGfzxbW'];
    googlesAnswer = ['_p~iF~ps|U', '_ulLnnqC', '_mqNvxq`@'];
    fullHash = manyHashes.reduce(function(prev, current) {
      return prev + current;
    });
    googlesFullHash = googlesAnswer.reduce(function(prev, current) {
      return prev + current;
    });
    describe('GoogleHash64', function() {
      describe('encode', function() {
        return describe('via LatLon Object', function() {
          describe('individual hashses', function() {
            return manyPoints.forEach(function(point, i) {
              return it(point, function() {
                return (new geohash64.GoogleLatLon(point)).getGeoHash().hash.should.be.eql(manyHashes[i]);
              });
            });
          });
          describe('known google hashes, via encode method', function() {
            it(manyPoints, function() {
              return geohash64.encode(googlesPoints).should.eql(googlesFullHash);
            });
            return it('another long set', function() {
              return geohash64.encode([[30.90040, -87.51309], [30.59827, -81.64640], [27.05724, -80.06436], [25.16325, -80.61368], [26.01539, -81.82218], [27.85663, -82.81095], [29.07352, -82.83299], [30.04824, -84.06339], [29.70529, -85.14005], [30.48472, -86.48038], [30.21927, -87.82071], [30.91926, -87.99649], [30.87372, -87.51384]]).should.eql('ofr{DxkcuOh_z@yyxb@lrrTw~sHl|pJfhjB{leDb`kFwrfJxb`EqtlFvhC_k}D~hoFl~aAbhqEmfwC`xdG`zr@`xdG}ugCria@r{Gqg}A');
            });
          });
          return it('smaller', function() {
            geohash64.encode([[27.05724, -80.06436], [25.16325, -80.61368]]).should.be.eql('wrcdDfqtgNl|pJfhjB');
            return it('can deal with dupes', function() {
              geohash64.encode([[43.252, -126.453], [40.7, -120.95], [40.7, -120.95]]).should.eql('_t~fGfzxbW~lqNwxq`@??');
              return geohash64.encode([[43.252, -126.453], [40.7, -120.95], [40.7, -120.95], [40.7, -120.95]]).should.eql('_t~fGfzxbW~lqNwxq`@????');
            });
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
          it("" + googlesFullHash + " to " + googlesPoints, function() {
            return geohash64.decode(googlesFullHash, true).should.eql(googlesPoints);
          });
          return it('smaller', function() {
            return geohash64.decode('wrcdDfqtgNl|pJfhjB', true).should.eql([[27.05724, -80.06436], [25.16325, -80.61368]]);
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
            return it(manyPoints[0][1], function() {
              geohash64.GoogleCoder.encode(manyPoints[0][0]).should.be.equal('_atqG');
              return geohash64.GoogleCoder.encode(manyPoints[0][1]).should.be.equal('`~oia@');
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
            return it(manyPoints[0][1], function() {
              var isSingle, isZoom;
              return geohash64.GoogleCoder.decode('`~oia@', isZoom = false, isSingle = true).should.be.equal(manyPoints[0][1]);
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
      describe('geohash64 encodeZoom/decodeZoom Interfaces', function() {
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
      return describe('multiple hashed coords', function() {
        return it('return multiple points', function() {
          var array;
          array = geohash64.decode('_yr~Cn}grNfw@wcA', true);
          return array.should.be.eql([[26.152, -81.802], [26.143, -81.791]]);
        });
      });
    });
  });
});


/*
  Fix these specs later for other base64 algo
 */
