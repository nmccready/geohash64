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
