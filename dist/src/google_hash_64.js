var GoogleHash64,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

GoogleHash64 = (function() {
  function GoogleHash64(hash, center_ll, precision) {
    this.hash = hash;
    this.center_ll = center_ll;
    this.precision = precision != null ? precision : 6;
    this.hash2geo = bind(this.hash2geo, this);
    this.toString = bind(this.toString, this);
    _.extend(this, GoogleCoder);
    if (!_.isString(this.hash)) {
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
