
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
  return describe('should parse known google hashes', function() {
    it('38.5,-120.2', function() {
      return (new geohash64.GoogleLatLon(38.5, -120.2)).getGeoHash().should.be.eql('_p~iF~ps|U');
    });
    it('45,-179.98321', function() {
      return (new geohash64.GoogleLatLon(45, -179.98321)).getGeoHash().should.be.eql('_atqG`~oia@');
    });
    it('40.7,-120.95', function() {
      return (new geohash64.GoogleLatLon(40.7, -120.95)).getGeoHash().should.be.eql('_flwFn`faV');
    });
    return it('43.252,-126.453', function() {
      return (new geohash64.GoogleLatLon(43.252, -126.453)).getGeoHash().should.be.eql('_t~fGfzxbW');
    });
  });
});
