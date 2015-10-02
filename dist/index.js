/**
 *  geohash64
 *
 * @version: 1.0.6
 * @author: Nicholas McCready
 * @date: Thu Oct 01 2015 20:56:33 GMT-0400 (EDT)
 * @license: MIT
 */
(function(){
/*
  load with utf-8 encoding!!!!!!!!!!!!
 */

/*
 * base64url characters
 */
var all, chunkSize, decodeCoord, each, extend, float2int, geohash64, getChunks, mask, maybeFlip, ord, rounded;

geohash64 = (function() {
  var codeMap, i, indexStr, j, ref;
  indexStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  codeMap = {};
  for (i = j = 0, ref = indexStr.length; j <= ref; i = j += 1) {
    codeMap[indexStr[i]] = i;
  }
  return {
    codeMap: codeMap,
    indexStr: indexStr
  };
})();


/*
  private (hidden) functions
 */

each = function(coll, cb) {
  var key, results, val;
  results = [];
  for (key in coll) {
    val = coll[key];
    if (!coll.hasOwnProperty(key)) {
      break;
    }
    results.push(cb(val, key));
  }
  return results;
};

extend = function(toExtend, extender) {
  each(extender, function(field, fieldName) {
    return toExtend[fieldName] = field;
  });
  return toExtend;
};

all = function(coll, cb) {
  var k, pass, val;
  pass = true;
  for (k in coll) {
    val = coll[k];
    if (!!coll.hasOwnProperty(k)) {
      break;
    }
    if (!cb(val)) {
      pass = false;
      break;
    }
  }
  return pass;
};

float2int = function(value) {
  return value | 0;
};

decodeCoord = function(coord) {
  if (coord & 0x1) {
    coord = ~coord;
  }
  coord >>= 1;
  return coord /= 100000.0;
};

maybeFlip = function(value) {
  if (value < 0) {
    return ~value;
  }
  return value;
};

rounded = function(value) {
  return Math.round(1e5 * value);
};

mask = 0x1F;

chunkSize = 5;

getChunks = function(value) {
  var chunks;
  chunks = [];
  while (value >= 32) {
    (function() {
      chunks.push((value & mask) | 0x20);
      return value >>= chunkSize;
    })();
  }
  chunks.push(value);
  return chunks;
};

ord = function(str) {
  return str.charCodeAt(0);
};

var LatLon,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

LatLon = (function() {
  function LatLon(arg1, arg2) {
    this.distance_from = bind(this.distance_from, this);
    this.distance_to = bind(this.distance_to, this);
    this.getGeoHash = bind(this.getGeoHash, this);
    this.add = bind(this.add, this);
    this.toString = bind(this.toString, this);
    var arg1Type, arg2Type, lat, lon;
    if (Array.isArray(arg1)) {
      lat = arg1[0];
      lon = arg1[1];
    } else {
      lat = arg1;
      lon = arg2;
    }
    if (arg1 == null) {
      throw new Error('One of LatLong arg1');
    }
    if (arg2 != null) {
      arg2Type = typeof arg2;
      arg1Type = typeof arg1;
      if (arg2Type !== arg1Type) {
        throw new Error("arg1 to arg2 type mismatch: arg1 type: " + arg1Type + ", arg2 type: " + arg2Type);
      }
    }
    if (!(-90 <= lat && lat <= 90)) {
      throw new Error('lat is out of range.');
    }
    if (!(-180 <= lon && lon <= 180)) {
      throw new Error('lon is out of range.');
    }
    this.lat = Number(lat);
    this.lon = Number(lon);
  }

  LatLon.prototype.toString = function() {
    return "LatLon unit='degree'\nlat:" + this.lat + ", lon:" + this.lon + ",";
  };

  LatLon.prototype.add = function(ll) {
    return new LatLon(this.lat + ll.lat, this.lon + ll.lon);
  };

  LatLon.prototype.getGeoHash = function(precision) {
    var fn, hash, i, j, lat, lon, ref;
    if (precision == null) {
      precision = 10;
    }
    if (!(0 < precision)) {
      throw new Error('precision is out of range.');
    }
    lat = (this.lat + 90) / 180;
    lon = (this.lon + 180) / 360;
    hash = '';
    fn = function(i) {
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
      return hash += indexStr[index];
    };
    for (i = j = 0, ref = precision; j < ref; i = j += 1) {
      fn(i);
    }
    return new GeoHash64(hash);
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

var Coordinate,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Coordinate = (function() {
  function Coordinate(n, e) {
    this.toString = bind(this.toString, this);
    this.n = n;
    this.e = e;
  }

  Coordinate.prototype.toString = function() {
    return "Coordinate: n: " + this.n + ", e: " + this.e;
  };

  return Coordinate;

})();

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
    if (typeof hash !== 'string') {
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


/*
 NOTE in testing this library against google; you are only garunteed to get matches
 (encded hash to decoded points) for up to 5 decimals of accuracy. Therefore if you
 play with the Google Widget only encode lat lons with 5 decimals max.

 https://google-developers.appspot.com/maps/documentation/utilities/polylineutility_63b1683dd5bb00fea0eb2d1356fa8a61.frame?hl=en
 */
var GoogleCoder;

GoogleCoder = {
  encode: function(value, isZoom) {
    var asciiIndex, c, chunks, hash, hashToAdd, j, len;
    hash = '';
    if (!isZoom) {
      value = rounded(value);
    }
    if (!isZoom) {
      value = maybeFlip(value << 1);
    }
    chunks = getChunks(value);
    for (j = 0, len = chunks.length; j < len; j++) {
      c = chunks[j];
      asciiIndex = c + 63;
      hashToAdd = String.fromCharCode(asciiIndex);
      hash += hashToAdd;
    }
    return hash;
  },
  decode: function(hash, isZoomLevel, isSingle) {
    var char, chunkSet, coord_chunks, coords, j, len, split_after, value;
    coord_chunks = [[]];
    chunkSet = 0;
    for (j = 0, len = hash.length; j < len; j++) {
      char = hash[j];
      value = ord(char) - 63;
      split_after = !(value & 0x20);
      value &= mask;
      coord_chunks[chunkSet].push(value);
      if (split_after) {
        chunkSet += 1;
        coord_chunks.push([]);
      }
    }
    coord_chunks.pop();
    coords = coord_chunks.map(function(coord_chunk) {
      var coord;
      coord = 0;
      each(coord_chunk, function(chunk, i) {
        return coord |= chunk << (i * 5);
      });
      if (!isZoomLevel) {
        coord = decodeCoord(coord);
      }
      return coord;
    });
    if (isSingle) {
      return coords[0];
    }
    return coords;
  },
  round: function(value, precision) {
    return value.toFixed(precision);
  },
  tuple: function(left, right, factory) {
    if (factory == null) {
      factory = GoogleLatLon;
    }
    return new factory(left, right);
  }
};

var GoogleHash64,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

GoogleHash64 = (function() {
  function GoogleHash64(hash, center_ll, precision) {
    this.hash = hash;
    this.center_ll = center_ll;
    this.precision = precision != null ? precision : 6;
    this.hash2geo = bind(this.hash2geo, this);
    this.toString = bind(this.toString, this);
    extend(this, GoogleCoder);
    if (typeof this.hash !== 'string') {
      throw new Error('Argument is invalid');
    }
    if (!this.center_ll) {
      this.hash2geo();
    }
  }

  GoogleHash64.prototype.toString = function() {
    return "GoogleHash64:\nhash: " + this.hash + ",center_ll: " + this.center_ll;
  };

  GoogleHash64.prototype.hash2geo = function(doReturnPoints) {
    var coords, fn, i, j, points, prev_x, prev_y, ref;
    if (doReturnPoints == null) {
      doReturnPoints = false;
    }
    'Decodes a polyline that has been encoded using Google\'s algorithm\nhttp://code.google.com/apis/maps/documentation/polylinealgorithm.html\n\nThis is a generic method that returns a list of (latitude, longitude)\ntuples.\n\n:param point_str: Encoded polyline string.\n:type point_str: string\n:returns: List of 2-tuples where each tuple is (latitude, longitude)\n:rtype: list\n';
    coords = this.decode(this.hash);
    points = [];
    prev_x = 0;
    prev_y = 0;
    fn = (function(_this) {
      return function(i) {
        if (!(coords[i] === 0 && coords[i + 1] === 0)) {
          prev_y += coords[i + 1];
          prev_x += coords[i];
          _this.center_ll = _this.tuple(_this.round(prev_x, _this.precision), _this.round(prev_y, _this.precision));
          return points.push(_this.center_ll);
        }
      };
    })(this);
    for (i = j = 0, ref = coords.length; j < ref; i = j += 2) {
      fn(i);
    }
    if (doReturnPoints) {
      return points;
    }
    return this.center_ll;
  };

  return GoogleHash64;

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
var GoogleLatLon,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend1 = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

GoogleLatLon = (function(superClass) {
  extend1(GoogleLatLon, superClass);

  function GoogleLatLon(arg1, arg2) {
    this.getGeoHash = bind(this.getGeoHash, this);
    this.toEqual = bind(this.toEqual, this);
    this.toString = bind(this.toString, this);
    var previousCoord;
    extend(this, GoogleCoder);
    GoogleLatLon.__super__.constructor.call(this, arg1, arg2);
    if ((arg2 != null) && Array.isArray(arg2)) {
      previousCoord = arg2;
      this.from = new GoogleLatLon(previousCoord);
      this.magnitude = new GoogleLatLon(this.lat - this.from.lat, this.lon - this.from.lon);
    }
  }

  GoogleLatLon.prototype.toString = function() {
    return "GoogleLatLon unit='degree'\nlat:" + this.lat + ", lon:" + this.lon;
  };

  GoogleLatLon.prototype.toEqual = function(other) {
    return other.lat === this.lat && other.lon === this.lon;
  };

  GoogleLatLon.prototype.getGeoHash = function(precision, set) {
    var hash;
    if (!set) {
      set = this.magnitude == null ? [this.lat, this.lon] : [this.magnitude.lat, this.magnitude.lon];
    }
    hash = '';
    set.map((function(_this) {
      return function(coord) {
        return hash += _this.encode(coord);
      };
    })(this));
    return new GoogleHash64(hash, this);
  };

  return GoogleLatLon;

})(LatLon);

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
  var allAreValid, array, finalHash, i, latLon, len, previous;
  if (precision == null) {
    precision = 5;
  }
  if (encoder == null) {
    encoder = GoogleLatLon;
  }
  if (!(latLonArray != null ? latLonArray.length : void 0)) {
    throw new Error('One location pair must exist');
  }
  allAreValid = all(latLonArray, function(latLon) {
    return latLon.length === 2;
  });
  if (!allAreValid) {
    throw new Error('All lat/lon objects are valid');
  }
  finalHash = '';
  previous = void 0;
  for (i = 0, len = latLonArray.length; i < len; i++) {
    array = latLonArray[i];
    latLon = new encoder(array, previous);
    previous = array;
    finalHash += latLon.getGeoHash(precision).hash;
  }
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

})();