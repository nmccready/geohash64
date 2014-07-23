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
    this.south_west_ll = void 0;
    this.center_ll = void 0;
    this.hash2geo();
  }

  GeoHash64.prototype.toString = function() {
    return "geohash64.GeoHash64:\nhash: " + this.hash + ",\ncenter_ll: " + this.center_ll + ",\nsouth_west_ll: " + this.south_west_ll + ",\nerror: " + this.error + ",\ncoordinate_error: " + this.coordinate_error + ",\nprecision: " + this.precision;
  };

  GeoHash64.prototype.hash2geo = function() {
    var decimal, decimal_list, lat, lon, s, _i;
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
    console.log(decimal_list);
    for (_i = decimal_list.length - 1; _i >= 0; _i += -1) {
      decimal = decimal_list[_i];
      console.log("DECIMAL: " + decimal);
      lat += (decimal >> 3) & 4;
      lon += (decimal >> 2) & 4;
      lat += (decimal >> 2) & 2;
      lon += (decimal >> 1) & 2;
      lat += (decimal >> 1) & 1;
      lon += (decimal >> 0) & 1;
      lat /= 8;
      lon /= 8;
    }
    this.ll = new geohash64.LatLon(lat * 180 - 90, lon * 360 - 180);
    this.set_error();
    this.south_west_ll = this.ll;
    return this.center_ll = this.ll.add(this.error);
  };

  GeoHash64.prototype.set_error = function() {
    this.error = new geohash64.LatLon(90.0 / Math.pow(8, this.precision), 180.0 / Math.pow(8, this.precision));
    return this.coordinate_error = new geohash64.Coordinate(this.ll.distance_to(new geohash64.LatLon(this.ll.lat + this.error.lat, this.ll.lon)), this.ll.distance_to(new geohash64.LatLon(this.ll.lat, this.ll.lon + this.error.lon)));
  };

  return GeoHash64;

})();
