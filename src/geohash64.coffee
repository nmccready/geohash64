###############################################################################
# GeoHash64 Class
###############################################################################
namespace 'geohash64'
class geohash64.GeoHash64
  constructor: (hash, precision = 10) ->
    throw new Error 'Argument is invalid' unless _.isString hash
    @hash = hash
    @precision = @hash.length
    @hash2geo()

  toString: =>
    """geohash64.GeoHash64:
            hash: #{@hash},
            center_ll: #{@center_ll},
            south_west_ll: #{@south_west_ll},
            error: #{@error},
            coordinate_error: #{@coordinate_error},
            precision: #{@precision}
            hash2geo: #{hash2geo}
            set_error: #{set_error}
    """
  hash2geo: =>
    decimal_list = [geohash64.codeMap[s] for s in @hash] # s = "Z"

    lat = 0.0
    lon = 0.0
    for decimal in [decimal_list.length - 1..0] by -1
      # decimal = 25 = 0b011001
      lat += (decimal >> 3) & 4 # => 0b100
      lon += (decimal >> 2) & 4 # => 0b100
      lat += (decimal >> 2) & 2 # => 0b010
      lon += (decimal >> 1) & 2 # => 0b010
      lat += (decimal >> 1) & 1 # => 0b001
      lon += (decimal >> 0) & 1 # => 0b001
      lat /= 8 # >>=3
      lon /= 8 # >>=3

    @_ll = new geohash64.LatLon(lat * 180 - 90, lon * 360 - 180)

    @set_error()

  set_error: =>
    @error = new geohash64.LatLon 90.0 / 8 ** @precision, 180.0 / 8 ** @precision
    @coordinate_error = new geohash64.Coordinate(
      @_ll.distance_to(new geohash64.LatLon(@_ll.lat + @error.lat, @_ll.lon)),
      @_ll.distance_to(new geohash64.LatLon(@_ll.lat, @_ll.lon + @error.lon))
    )