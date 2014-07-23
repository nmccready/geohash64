var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

namespace('geohash64');

geohash64.GeoHash64 = (function() {
  function GeoHash64(hash, precision) {
    if (precision == null) {
      precision = 10;
    }
    this.set_error = __bind(this.set_error, this);
    this.hash2geo = __bind(this.hash2geo, this);
    this.toString = __bind(this.toString, this);
    if (!_.isString(hash)) {
      throw new Error('Argument is invalid');
    }
    this.hash = hash;
    this.precision = this.hash.length;
    this.hash2geo();
  }

  GeoHash64.prototype.toString = function() {
    return "geohash64.GeoHash64:\nhash: " + this.hash + ",\ncenter_ll: " + this.center_ll + ",\nsouth_west_ll: " + this.south_west_ll + ",\nerror: " + this.error + ",\ncoordinate_error: " + this.coordinate_error + ",\nprecision: " + this.precision + "\nhash2geo: " + hash2geo + "\nset_error: " + set_error;
  };

  GeoHash64.prototype.hash2geo = function() {
    var decimal, decimal_list, lat, lon, s, _i, _ref;
    decimal_list = [
      (function() {
        var _i, _len, _ref, _results;
        _ref = this.hash;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          s = _ref[_i];
          _results.push(geohash64.codeMap[s]);
        }
        return _results;
      }).call(this)
    ];
    lat = 0.0;
    lon = 0.0;
    for (decimal = _i = _ref = decimal_list.length - 1; _i >= 0; decimal = _i += -1) {
      lat += (decimal >> 3) & 4;
      lon += (decimal >> 2) & 4;
      lat += (decimal >> 2) & 2;
      lon += (decimal >> 1) & 2;
      lat += (decimal >> 1) & 1;
      lon += (decimal >> 0) & 1;
      lat /= 8;
      lon /= 8;
    }
    this._ll = new geohash64.LatLon(lat * 180 - 90, lon * 360 - 180);
    return this.set_error();
  };

  GeoHash64.prototype.set_error = function() {
    this.error = new geohash64.LatLon(90.0 / Math.pow(8, this.precision), 180.0 / Math.pow(8, this.precision));
    return this.coordinate_error = new geohash64.Coordinate(this._ll.distance_to(new geohash64.LatLon(this._ll.lat + this.error.lat, this._ll.lon)), this._ll.distance_to(new geohash64.LatLon(this._ll.lat, this._ll.lon + this.error.lon)));
  };

  return GeoHash64;

})();
