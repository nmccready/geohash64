(function() {
  module.exports = {
    encode: function(latLonArray, precision) {
      var allAreValid, ctr, finalHash;
      if (precision == null) {
        precision = 10;
      }
      if (!(latLonArray != null ? latLonArray.length : void 0)) {
        throw new Error('One location pair must exist');
      }
      allAreValid = _(latLonArray).all(function(latLon) {
        return (latLon.getGeoHash64 != null) && (latLon.lat != null) && (latLon.lon != null) && typeof latLon === 'geohash64.GeoHash64';
      });
      if (!allAreValid) {
        throw new Error('All lat/lon objects are valid');
      }
      finalHash = '';
      ctr = 0;
      latLonArray.forEach(function(ll) {
        var append;
        append = ctr > 0 ? ',' : '';
        finalHash = ll.getGeoHash64(precision).hash + append;
        return ctr += 1;
      });
      return finalHash;
    },
    decode: function(hash, doParseComma) {
      var hashArray;
      ({
        _dcode: function(hash) {
          return new GeoHash64(hash).center_ll;
        }
      });
      if (!doParseComma) {
        return [_dcode(hash)];
      }
      hashArray = hash.split(',');
      return hashArray.map(function(hash) {
        return _dcode(hash);
      });
    }
  };

}).call(this);
