namespace('geohash64');


/*
  encode:
  arguments:
    latLonArray: an array or latLon(Array Objects) - ie: [[36,140.0]], where lat = 36, and lon = 140
    (precision): number of decimal place accuracy
    (encoder): a LatLon object type to use as the encoding object
 */

geohash64.encode = function(latLonArray, precision, encoder) {
  var allAreValid, finalHash;
  if (precision == null) {
    precision = 5;
  }
  if (encoder == null) {
    encoder = geohash64.GoogleLatLon;
  }
  if (!(latLonArray != null ? latLonArray.length : void 0)) {
    throw new Error('One location pair must exist');
  }
  allAreValid = _.all(latLonArray, function(latLon) {
    return latLon.length === 2;
  });
  if (!allAreValid) {
    throw new Error('All lat/lon objects are valid');
  }
  finalHash = '';
  latLonArray.forEach(function(ll) {
    ll = new encoder(ll[0], ll[1]);
    return finalHash += ll.getGeoHash(precision).hash;
  });
  return finalHash;
};

geohash64.decode = function(hash, doParseComma) {
  var hashArray, _dcode;
  _dcode = function(hash) {
    return new geohash64.GeoHash64(hash).center_ll;
  };
  if (!doParseComma) {
    return [_dcode(hash)];
  }
  hashArray = hash.split(',');
  return hashArray.map(function(hash) {
    return _dcode(hash);
  });
};

module.exports = {
  encode: geohash64.encode,
  decode: geohash64.decode,
  LatLon: geohash64.LatLon,
  Coordinate: geohash64.Coordinate,
  GeoHash64: geohash64.GeoHash64,
  GoogleLatLon: geohash64.GoogleLatLon,
  GoogleHash64: geohash64.GoogleHash64
};
