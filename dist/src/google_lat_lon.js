
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
    this.toEqual = __bind(this.toEqual, this);
    this.toString = __bind(this.toString, this);
    return GoogleLatLon.__super__.constructor.apply(this, arguments);
  }

  GoogleLatLon.prototype.toString = function() {
    return "geohash64.GoogleLatLon unit='degree'\nlat:" + this.lat + ", lon:" + this.lon;
  };

  GoogleLatLon.prototype.toEqual = function(other) {
    return other.lat === this.lat && other.lon === this.lon;
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

  GoogleLatLon.prototype.getGeoHash = function(precision, set) {
    var hash;
    if (!set) {
      set = [this.lat, this.lon];
    }
    hash = '';
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
    return new geohash64.GoogleHash64(hash, this);
  };

  return GoogleLatLon;

})(geohash64.LatLon);
