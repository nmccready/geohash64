/**
 *  geodecoder64js
 *
 * @version: 0.0.0
 * @author: Nicholas McCready
 * @date: Tue Jul 22 2014 19:21:29 GMT-0400 (EDT)
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
    _global.ns2 = require('ns2');
    _global.namespace = ns2.namespace;
  }

  namespace('geohash64.Base64Map');

  geohash64.Base64Map = (function() {
    var base64Map, base64Str, i, _i, _ref;
    base64Str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    base64Map = {};
    for (i = _i = 0, _ref = base64Str.length; _i <= _ref; i = _i += 1) {
      base64Map[base64Str[i]] = i;
    }
    return {
      base64Str: base64Str,
      base64Map: base64Map
    };
  })();

  _global.float2int = function(value) {
    return value | 0;
  };

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ns2.namespace('geohash64');

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
      return "geohash64.LatLon unit='degree' lat:" + this.lat + ", lon:" + this.lon;
    };

    LatLon.prototype.add = function(ll) {
      return new LatLon(this.lat + ll.lat, this.lon + ll.lon);
    };

    LatLon.prototype.getGeoHash64 = function(precision) {
      var hash, i, lat, lon, _fn, _i;
      if (precision == null) {
        precision = 10;
      }
      if (!0 < precision) {
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
        return hash += geohash64.Base64Map.base64Str[index];
      };
      for (i = _i = 0; 0 <= precision ? _i <= precision : _i >= precision; i = 0 <= precision ? ++_i : --_i) {
        _fn(i);
      }
      return GeoHash64(hash);
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
      if (!typeof another_LatLon === 'geohash64.LatLon') {
        throw new Error('Argument is not LatLon');
      }
      lat1_rad = this.lat * math.pi / 180;
      lon1_rad = this.lon * math.pi / 180;
      lat2_rad = another_LatLon.lat * math.pi / 180;
      lon2_rad = another_LatLon.lon * math.pi / 180;
      lat_average_rad = (lat1_rad + lat2_rad) / 2;
      lat_diff = lat1_rad - lat2_rad;
      lon_diff = lon1_rad - lon2_rad;
      meridian = 6335439.327 / Math.pow(Math.pow(1 - 0.006694379990 * Math.pow(math.sin(lat_average_rad), 2), 3), 0.5);
      prime_vertical = 6378137.000 / Math.pow(1 - 0.006694379990 * Math.pow(math.sin(lat_average_rad), 2), 0.5);
      return Math.pow(Math.pow(meridian * lat_diff, 2) + Math.pow(prime_vertical * math.cos(lat_average_rad) * lon_diff, 2), 0.5);
    };

    return LatLon;

  })();

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ns2.namespace('geohash64');

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
