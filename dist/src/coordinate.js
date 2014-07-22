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
