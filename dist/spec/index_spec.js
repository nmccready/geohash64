
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
  var manyHashes, manyPoints;
  manyPoints = [[38.5, -120.2], [45, -179.98321], [40.7, -120.95], [43.252, -126.453]];
  manyHashes = ['_p~iF~ps|U', '_atqG`~oia@', '_flwFn`faV', '_t~fGfzxbW'];
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
    return describe('via encoder method', function() {
      return it(manyPoints, function() {
        return geohash64.encode(manyPoints).should.eql(manyHashes.reduce(function(prev, current) {
          return prev + current;
        }));
      });
    });
  });
  return describe('decode', function() {
    return describe('known google hashes', function() {
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
  });
});
