var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

namespace('geohash64');

geohash64.GoogleHash64 = (function() {
  function GoogleHash64(hash, center_ll, precision) {
    this.hash = hash;
    this.center_ll = center_ll;
    this.precision = precision != null ? precision : 6;
    this.hash2geo = __bind(this.hash2geo, this);
    this.toString = __bind(this.toString, this);
    if (!_.isString(this.hash)) {
      throw new Error('Argument is invalid');
    }
    if (!this.center_ll) {
      this.hash2geo();
    }
  }

  GoogleHash64.prototype.toString = function() {
    return "geohash64.GoogleHash64:\nhash: " + this.hash + ",center_ll: " + this.center_ll;
  };

  GoogleHash64.prototype.ord = function(str) {
    return str.charCodeAt(0);
  };

  GoogleHash64.prototype.round = function(value) {
    return value.toFixed(this.precision);
  };

  GoogleHash64.prototype.tuple = function(left, right) {
    return new geohash64.GoogleLatLon(left, right);
  };

  GoogleHash64.prototype.mask = 0x1F;

  GoogleHash64.prototype.hash2geo = function(doReturnPoints) {
    var chunkSet, coord_chunks, coords, i, point_str, points, prev_x, prev_y, _fn, _i, _ref;
    if (doReturnPoints == null) {
      doReturnPoints = false;
    }
    point_str = this.hash;
    'Decodes a polyline that has been encoded using Google\'s algorithm\nhttp://code.google.com/apis/maps/documentation/polylinealgorithm.html\n\nThis is a generic method that returns a list of (latitude, longitude)\ntuples.\n\n:param point_str: Encoded polyline string.\n:type point_str: string\n:returns: List of 2-tuples where each tuple is (latitude, longitude)\n:rtype: list\n';
    coord_chunks = [[]];
    chunkSet = 0;
    _(point_str).each((function(_this) {
      return function(char) {
        var split_after, value;
        value = _this.ord(char) - 63;
        split_after = !(value & 0x20);
        value &= _this.mask;
        coord_chunks[chunkSet].push(value);
        if (split_after) {
          chunkSet += 1;
          return coord_chunks.push([]);
        }
      };
    })(this));
    coord_chunks.pop();
    coord_chunks.forEach(function(chunk, key) {});
    coords = coord_chunks.map(function(coord_chunk) {
      var coord;
      coord = 0;
      coord_chunk.forEach(function(chunk, i) {
        return coord |= chunk << (i * 5);
      });
      if (coord & 0x1) {
        coord = ~coord;
      }
      coord >>= 1;
      coord /= 100000.0;
      return coord;
    });
    points = [];
    prev_x = 0;
    prev_y = 0;
    _fn = (function(_this) {
      return function(i) {
        if (!(coords[i] === 0 && coords[i + 1] === 0)) {
          prev_y += coords[i + 1];
          prev_x += coords[i];
          _this.center_ll = _this.tuple(_this.round(prev_x), _this.round(prev_y));
          points.push(_this.center_ll);
        }
        prev_x = 0;
        return prev_y = 0;
      };
    })(this);
    for (i = _i = 0, _ref = coords.length; _i < _ref; i = _i += 2) {
      _fn(i);
    }
    if (doReturnPoints) {
      return points;
    }
    return this.center_ll;
  };

  return GoogleHash64;

})();
