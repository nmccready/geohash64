var GeoHash64,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

GeoHash64 = (function() {
  function GeoHash64(hash, precision) {
    if (precision == null) {
      precision = 5;
    }
    this.set_error = bind(this.set_error, this);
    this.hash2geo = bind(this.hash2geo, this);
    this.toString = bind(this.toString, this);
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
    return "GeoHash64:\nhash: " + this.hash + ",\ncenter_ll: " + this.center_ll + ",\nsouth_west_ll: " + this.south_west_ll + ",\nerror: " + this.error + ",\ncoordinate_error: " + this.coordinate_error + ",\nprecision: " + this.precision;
  };

  GeoHash64.prototype.hash2geo = function() {
    var decimal, decimal_list, i, lat, lon, s;
    decimal_list = [
      (function() {
        var i, len, ref, results;
        ref = this.hash;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          s = ref[i];
          results.push(codeMap[s]);
        }
        return results;
      }).call(this)
    ];
    lat = 0.0;
    lon = 0.0;
    console.info(decimal_list);
    for (i = decimal_list.length - 1; i >= 0; i += -1) {
      decimal = decimal_list[i];
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
    this.ll = new LatLon(lat * 180 - 90, lon * 360 - 180);
    this.set_error();
    this.south_west_ll = this.ll;
    return this.center_ll = this.ll.add(this.error);
  };

  GeoHash64.prototype.set_error = function() {
    this.error = new LatLon(90.0 / Math.pow(8, this.precision), 180.0 / Math.pow(8, this.precision));
    return this.coordinate_error = new Coordinate(this.ll.distance_to(new LatLon(this.ll.lat + this.error.lat, this.ll.lon)), this.ll.distance_to(new LatLon(this.ll.lat, this.ll.lon + this.error.lon)));
  };

  return GeoHash64;

})();
