/**
 *  geodecoder64js
 *
 * @version: 0.0.0
 * @author: Nicholas McCready
 * @date: Tue Jul 22 2014 20:53:56 GMT-0400 (EDT)
 * @license: MIT
 */
isNode =
  !(typeof window !== "undefined" && window !== null);



/*
  load with utf-8 encoding!!!!!!!!!!!!
 */

(function() {
  var getGlobal, _global;

  getGlobal = function() {
    if (isNode) {
      return global;
    } else {
      return window;
    }
  };

  _global = getGlobal();

  _global.getGlobal = getGlobal;

  _global.isNode = isNode;

  if (isNode) {
    _global.bigint = require('bigint');
    _global.base64 = require('base-64');
    _global._ = require('lodash');
    _global.ns2 = require('ns2');
    _global.namespace = ns2.namespace;
  }

  namespace('geohash64');


  /*
   * base64url characters
   */

  _global.geohash64 = (function() {
    var codeMap, i, indexStr, _i, _ref;
    indexStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    codeMap = {};
    for (i = _i = 0, _ref = indexStr.length; _i <= _ref; i = _i += 1) {
      codeMap[indexStr[i]] = i;
    }
    return {
      codeMap: codeMap,
      indexStr: indexStr
    };
  })();

  _global.float2int = function(value) {
    return value | 0;
  };

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  namespace('geohash64');

  geohash64.LatLon = (function() {
    function LatLon(lat, lon) {
      this.distance_from = __bind(this.distance_from, this);
      this.distance_to = __bind(this.distance_to, this);
      this.getGeoHash64 = __bind(this.getGeoHash64, this);
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
      return "geohash64.LatLon unit='degree'\nlat:" + this.lat + ", lon:" + this.lon + ",\ngetGeoHash64: " + this.getGeoHash64 + ",\ndistance_to: " + this.distance_to + ",\ndistance_from: " + this.distance_from;
    };

    LatLon.prototype.add = function(ll) {
      return new LatLon(this.lat + ll.lat, this.lon + ll.lon);
    };

    LatLon.prototype.getGeoHash64 = function(precision) {
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
      for (i = _i = 0; 0 <= precision ? _i <= precision : _i >= precision; i = 0 <= precision ? ++_i : --_i) {
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

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  namespace('geohash64');

  geohash64.Coordinate = (function() {
    function Coordinate(n, e) {
      this.toString = __bind(this.toString, this);
      this.n = n;
      this.e = e;
    }

    Coordinate.prototype.toString = function() {
      return "geohash64.Coordinate: n: " + this.n + ", e: " + this.e;
    };

    return Coordinate;

  })();

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ns2.namespace('geohash64');

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

}).call(this);

(function() {
  namespace('geohash64');

  geohash64.encode = function(latLonArray, precision) {
    var allAreValid, ctr, finalHash;
    if (precision == null) {
      precision = 10;
    }
    if (!(latLonArray != null ? latLonArray.length : void 0)) {
      throw new Error('One location pair must exist');
    }
    allAreValid = _.all(latLonArray, function(latLon) {
      return ((latLon != null ? latLon.getGeoHash64 : void 0) != null) && (latLon.lat != null) && (latLon.lon != null);
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
  };

  geohash64.decode = function(hash, doParseComma) {
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
  };

  module.exports = {
    encode: geohash64.encode,
    decode: geohash64.decode
  };

}).call(this);
