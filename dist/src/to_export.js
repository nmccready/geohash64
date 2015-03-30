var _decode, _encode, pkg;

pkg = require('../package.json');


/*
  encode:
  arguments:
    latLonArray: an array or latLon(Array Objects) - ie: [[36,140.0]], where lat = 36, and lon = 140
    (precision): number of decimal place accuracy
    (encoder): a LatLon object type to use as the encoding object
 */

_encode = function(latLonArray, precision, encoder) {
  var allAreValid, finalHash, previous;
  if (precision == null) {
    precision = 5;
  }
  if (encoder == null) {
    encoder = GoogleLatLon;
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
  previous = void 0;
  latLonArray.forEach(function(array) {
    var latLon;
    latLon = new encoder(array, previous);
    previous = array;
    return finalHash += latLon.getGeoHash(precision).hash;
  });
  return finalHash;
};

_decode = function(hash, doConvertToLatLonArrayOfArray, decoder, type) {
  var doReturnPoints, hasher, points;
  if (decoder == null) {
    decoder = GoogleHash64;
  }
  if (type == null) {
    type = 'GoogleHash64';
  }
  hasher = new decoder(hash, true);
  points = hasher.hash2geo(doReturnPoints = true);
  if (!doConvertToLatLonArrayOfArray) {
    return points;
  }
  return points.map(function(latLon) {
    return [latLon.lat, latLon.lon];
  });
};

module.exports = {
  encode: _encode,
  decode: _decode,
  encodeZoom: function(intNum) {
    var isZoom;
    return GoogleCoder.encode(intNum, isZoom = true);
  },
  decodeZoom: function(hash) {
    var isSingle, isZoom;
    return GoogleCoder.decode(hash, isZoom = true, isSingle = true);
  },
  LatLon: LatLon,
  Coordinate: Coordinate,
  GeoHash64: GeoHash64,
  GoogleLatLon: GoogleLatLon,
  GoogleHash64: GoogleHash64,
  GoogleCoder: GoogleCoder,
  name: pkg.name,
  version: pkg.version
};
