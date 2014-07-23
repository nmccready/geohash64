###############################################################################
# Coordinate Class
###############################################################################
namespace 'geohash64'
class geohash64.Coordinate
  constructor: (n, e) ->
    @n = n
    @e = e

  toString: =>
    "geohash64.Coordinate: n: #{@n}, e: #{@e}"