
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

  GoogleLatLon.include(geohash64.GoogleCoder);

  function GoogleLatLon(arg1, arg2) {
    this.getGeoHash = __bind(this.getGeoHash, this);
    this.toEqual = __bind(this.toEqual, this);
    this.toString = __bind(this.toString, this);
    var previousCoord;
    GoogleLatLon.__super__.constructor.call(this, arg1, arg2);
    if ((arg2 != null) && _.isArray(arg2)) {
      previousCoord = arg2;
      this.from = new geohash64.GoogleLatLon(previousCoord);
      this.magnitude = new geohash64.GoogleLatLon(this.lat - this.from.lat, this.lon - this.from.lon);
    }
  }

  GoogleLatLon.prototype.toString = function() {
    return "geohash64.GoogleLatLon unit='degree'\nlat:" + this.lat + ", lon:" + this.lon;
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
    return new geohash64.GoogleHash64(hash, this);
  };

  return GoogleLatLon;

})(geohash64.LatLon);
