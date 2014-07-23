var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

namespace('geohash64');

geohash64.LatLon = (function() {
  function LatLon(lat, lon) {
    this.distance_from = __bind(this.distance_from, this);
    this.distance_to = __bind(this.distance_to, this);
    this.getGeoHash = __bind(this.getGeoHash, this);
    this.add = __bind(this.add, this);
    this.toString = __bind(this.toString, this);
    if (!(-90 <= lat && lat <= 90)) {
      throw new Error('lat is out of range.');
    }
    if (!(-180 <= lon && lon <= 180)) {
      throw new Error('lon is out of range.');
    }
    this.lat = parseFloat(lat);
    this.lon = parseFloat(lon);
  }

  LatLon.prototype.toString = function() {
    return "geohash64.LatLon unit='degree'\nlat:" + this.lat + ", lon:" + this.lon + ",";
  };

  LatLon.prototype.add = function(ll) {
    return new LatLon(this.lat + ll.lat, this.lon + ll.lon);
  };

  LatLon.prototype.getGeoHash = function(precision) {
    var hash, i, lat, lon, _fn, _i;
    if (precision == null) {
      precision = 10;
    }
    if (!(0 < precision)) {
      throw new Error('precision is out of range.');
    }
    lat = (this.lat + 90) / 180;
    lon = (this.lon + 180) / 360;
    hash = '';
    _fn = function(i) {
      var index, lat_int, lon_int;
      lat *= 8;
      lon *= 8;
      lat_int = float2int(lat);
      lon_int = float2int(lon);
      index = (lat_int << 3) & 32;
      +((lon_int << 2) & 16);
      +((lat_int << 2) & 8);
      +((lon_int << 1) & 4);
      +((lat_int << 1) & 2);
      +((lon_int << 0) & 1);
      return hash += geohash64.indexStr[index];
    };
    for (i = _i = 0; _i < precision; i = _i += 1) {
      _fn(i);
    }
    return new geohash64.GeoHash64(hash);
  };

  LatLon.prototype.distance_to = function(another_LatLon) {
    return this.distance_from(another_LatLon);
  };

  LatLon.prototype.distance_from = function(another_LatLon) {

    /*
    Hubeny's formula
    http://yamadarake.web.fc2.com/trdi/2009/report000001.html
     */
    var lat1_rad, lat2_rad, lat_average_rad, lat_diff, lon1_rad, lon2_rad, lon_diff, meridian, prime_vertical;
    if (!(((another_LatLon != null ? another_LatLon.lat : void 0) != null) && ((another_LatLon != null ? another_LatLon.lon : void 0) != null))) {
      throw new Error('Argument is not LatLon');
    }
    lat1_rad = this.lat * Math.PI / 180;
    lon1_rad = this.lon * Math.PI / 180;
    lat2_rad = another_LatLon.lat * Math.PI / 180;
    lon2_rad = another_LatLon.lon * Math.PI / 180;
    lat_average_rad = (lat1_rad + lat2_rad) / 2;
    lat_diff = lat1_rad - lat2_rad;
    lon_diff = lon1_rad - lon2_rad;
    meridian = 6335439.327 / Math.pow(Math.pow(1 - 0.006694379990 * Math.pow(Math.sin(lat_average_rad), 2), 3), 0.5);
    prime_vertical = 6378137.000 / Math.pow(1 - 0.006694379990 * Math.pow(Math.sin(lat_average_rad), 2), 0.5);
    return Math.pow(Math.pow(meridian * lat_diff, 2) + Math.pow(prime_vertical * Math.cos(lat_average_rad) * lon_diff, 2), 0.5);
  };

  return LatLon;

})();
