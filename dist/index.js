/**
 *  geodecoder64js
 *
 * @version: 0.0.0
 * @author: Nicholas McCready
 * @date: Thu Jul 24 2014 12:02:18 GMT-0400 (EDT)
 * @license: MIT
 */
isNode =
  !(typeof window !== "undefined" && window !== null);



/*
  load with utf-8 encoding!!!!!!!!!!!!
 */
var base64, bigint, float2int, geohash64, getGlobal, namespace, ns2, utf8, _;

getGlobal = function() {
  if (isNode) {
    return global;
  } else {
    return window;
  }
};

if (isNode) {
  bigint = require('bigint');
  base64 = require('base-64');
  _ = require('lodash');
  ns2 = require('ns2');
  namespace = ns2.namespace;
  utf8 = require('utf8');
}

namespace('geohash64');


/*
 * base64url characters
 */

geohash64 = (function() {
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

float2int = function(value) {
  return value | 0;
};

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


/*
  GoogleLatLon Class
  desc: hash implementation of https://developers.google.com/maps/documentation/utilities/polylinealgorithm in nodejs
  author: nick mccready
  notes:
    a way to play around in node
    working from https://developers.google.com/maps/documentation/utilities/polylinealgorithm
    (((((maybeFlip((rounded)<< 1))>>0) <<25>>25) & 0x1F)|0x20) + 63 = 96
    (((((maybeFlip((rounded)<< 1))>>5) <<20>>20) & 0x1F)|0x20) + 63 = 126
    (((((maybeFlip((rounded)<< 1))>>10)<<15>>15) & 0x1F)|0x20) + 63 = 111
    (((((maybeFlip((rounded)<< 1))>>15)<<10>>10) & 0x1F)|0x20) + 63 = 105
    (((((maybeFlip((rounded)<< 1))>>10)<<20>>20) & 0x1F)|0x20) + 63 = 111
    (((((maybeFlip((rounded)<< 1))>>20)  <<5>>5) & 0x1F)|0x20) + 63 = 97
    (((((maybeFlip((rounded)<< 1))>>25)  <<0>>0) & 0x1F)) + 63 = 64 (final no 5 bit chunks left no OR of 0x20)
 */
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

namespace('geohash64');

geohash64.GoogleLatLon = (function(_super) {
  __extends(GoogleLatLon, _super);

  function GoogleLatLon() {
    this.getGeoHash = __bind(this.getGeoHash, this);
    this.toString = __bind(this.toString, this);
    return GoogleLatLon.__super__.constructor.apply(this, arguments);
  }

  GoogleLatLon.prototype.toString = function() {
    return "geohash64.GoogleLatLon unit='degree'\nlat:" + this.lat + ", lon:" + this.lon + ",";
  };

  GoogleLatLon.prototype.maybeFlip = function(value) {
    if (value < 0) {
      return ~value;
    }
    return value;
  };

  GoogleLatLon.prototype.rounded = function(value) {
    return Math.round(1e5 * value);
  };

  GoogleLatLon.prototype.mask = 0x1F;

  GoogleLatLon.prototype.chunkSize = 5;

  GoogleLatLon.prototype.getChunks = function(value) {
    var chunks;
    chunks = [];
    while (value >= 32) {
      (function(_this) {
        return (function() {
          chunks.push((value & _this.mask) | 0x20);
          return value >>= _this.chunkSize;
        });
      })(this)();
    }
    chunks.push(value);
    return chunks;
  };

  GoogleLatLon.prototype.getGeoHash = function(set) {
    var hash;
    if (!set) {
      set = [this.lat, this.lon];
    }
    hash = '';
    console.log("set: " + set);
    set.map((function(_this) {
      return function(coord) {
        var chunks, value;
        coord = _this.rounded(coord);
        value = _this.maybeFlip(coord << 1);
        chunks = _this.getChunks(value);
        return chunks.forEach(function(c) {
          var asciiIndex, hashToAdd;
          asciiIndex = c + 63;
          hashToAdd = String.fromCharCode(asciiIndex);
          return hash += hashToAdd;
        });
      };
    })(this));
    return hash;
  };

  return GoogleLatLon;

})(geohash64.LatLon);

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

namespace('geohash64');

geohash64.GoogleHash64 = (function() {
  function GoogleHash64(hash, precision) {
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

  GoogleHash64.prototype.toString = function() {
    return "geohash64.GeoHash64:\nhash: " + this.hash + ",\ncenter_ll: " + this.center_ll + ",";
  };

  GoogleHash64.prototype.hash2geo = function() {
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

  GoogleHash64.prototype.set_error = function() {
    this.error = new geohash64.LatLon(90.0 / Math.pow(8, this.precision), 180.0 / Math.pow(8, this.precision));
    return this.coordinate_error = new geohash64.Coordinate(this.ll.distance_to(new geohash64.LatLon(this.ll.lat + this.error.lat, this.ll.lon)), this.ll.distance_to(new geohash64.LatLon(this.ll.lat, this.ll.lon + this.error.lon)));
  };

  return GoogleHash64;

})();

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
  GoogleLatLon: geohash64.GoogleLatLon
};
