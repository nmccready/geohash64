
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
  it('should throw range error', function() {
    (function() {
      return new geohash64.LatLon(110, 135);
    }).should["throw"]();
    return (function() {
      return new geohash64.LatLon(45.1, -190);
    }).should["throw"]();
  });
  return it('hash', function() {
    var ll, precision;
    ll = new geohash64.LatLon(35.026131, 135.780673);
    (function() {
      var precision;
      return geohash64.encode([ll], precision = 0);
    }).should["throw"]();
    return geohash64.encode([ll], precision = 2).should.be.eql('3g');
  });
});
