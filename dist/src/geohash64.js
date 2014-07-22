(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ns2.namespace('geohash64');

  geohash64.GeoHash64 = (function() {
    function GeoHash64(hash, precision) {
      if (precision == null) {
        precision = 10;
      }
      this._set_error = __bind(this._set_error, this);
      this._hash2geo = __bind(this._hash2geo, this);
      this.toString = __bind(this.toString, this);
      if (!_.isString(hash)) {
        throw new Error('Argument is invalid');
      }
      this._hash = hash;
      this._precision = this.hash.length;
      this._hash2geo();
    }

    GeoHash64.prototype.toString = function() {
      return "geohash64.GeoHash64:\nhash: " + this._hash + ",\ncenter_ll: " + this.center_ll + ",\nsouth_west_ll: " + this.south_west_ll + ",\nerror: " + this.error + ",\ncoordinate_error: " + this.coordinate_error + ",\nprecision: " + this._precision;
    };

    GeoHash64.prototype._hash2geo = function() {
      var decimal, decimal_list, lat, lon, s, _i, _ref;
      decimal_list = [
        (function() {
          var _i, _len, _ref, _results;
          _ref = this._hash;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            s = _ref[_i];
            _results.push(_base64_map[s]);
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
      this._ll = LatLon(lat * 180 - 90, lon * 360 - 180);
      return this._set_error();
    };

    GeoHash64.prototype._set_error = function() {
      this._error = LatLon(90.0 / Math.pow(8, this._precision), 180.0 / Math.pow(8, this._precision));
      return this._coordinate_error = Coordinate(this._ll.distance_to(LatLon(this._ll.lat + this._error.lat, this._ll.lon)), this._ll.distance_to(LatLon(this._ll.lat, this._ll.lon + this._error.lon)));
    };

    return GeoHash64;

  })();

}).call(this);
