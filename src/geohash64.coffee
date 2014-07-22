###############################################################################
# GeoHash64 Class
###############################################################################
ns2.namespace 'geohash64'
class geohash64.GeoHash64
  constructor: (hash, precision = 10) ->
    throw new Error 'Argument is invalid' unless _.isString hash
    @_hash = hash
    @_precision = @hash.length
    @_hash2geo()

  toString: =>
    """geohash64.GeoHash64:
            hash: #{@_hash},
            center_ll: #{@center_ll},
            south_west_ll: #{@south_west_ll},
            error: #{@error},
            coordinate_error: #{@coordinate_error},
            precision: #{@_precision}
    """
  _hash2geo: =>
    decimal_list = [_base64_map[s] for s in @_hash] # s = "Z"

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

    @_ll = LatLon(lat * 180 - 90, lon * 360 - 180)

    @_set_error()

  _set_error: =>
    @_error = LatLon 90.0 / 8 ** @_precision, 180.0 / 8 ** @_precision
    @_coordinate_error = Coordinate(
      @_ll.distance_to(LatLon(@_ll.lat + @_error.lat, @_ll.lon)),
      @_ll.distance_to(LatLon(@_ll.lat, @_ll.lon + @_error.lon))
    )