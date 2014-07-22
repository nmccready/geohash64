###############################################################################
# LatLon Class
###############################################################################
ns2.namespace 'geohash64'
class geohash64.LatLon
  constructor: (lat, lon) ->
    if not (-90 <= lat and lat <= 90)
      throw new Error('lat is out of range.')
    if not (-180 <= lon and lon <= 180)
      throw new Error('lon is out of range.')
    @lat = parseFloat(lat)
    @lon = parseFloat(lon)

  toString: =>
    "geohash64.LatLon unit='degree' lat:#{@lat}, lon:#{@lon}"

  add: (ll) =>
    new LatLon @lat + ll.lat, @lon + ll.lon

  getGeoHash64:(precision=10) =>
    #"""LatLon => GeoHash64"""
    throw new Error('precision is out of range.') if not 0 < precision
    lat = (@lat + 90) / 180  # => 0.69091
    lon = (@lon + 180) / 360  # => 0.22069
    hash = ''

    for i in [0..precision]
      do(i) ->
        lat *= 8
        lon *= 8
        lat_int = float2int(lat)
        lon_int = float2int(lon)
        index = ((lat_int << 3) & 32)
        + ((lon_int << 2) & 16)
        + ((lat_int << 2) & 8)
        + ((lon_int << 1) & 4)
        + ((lat_int << 1) & 2)
        + ((lon_int << 0) & 1)
        hash += geohash64.Base64Map.base64Str[index]

    return GeoHash64(hash)

  distance_to:(another_LatLon)=>
    @distance_from(another_LatLon)

  distance_from:(another_LatLon) =>
    ###
    Hubeny's formula
    http://yamadarake.web.fc2.com/trdi/2009/report000001.html
    ###
    if not typeof another_LatLon == 'geohash64.LatLon'
      throw new Error 'Argument is not LatLon'
    lat1_rad = @lat * math.pi / 180
    lon1_rad = @lon * math.pi / 180
    lat2_rad = another_LatLon.lat * math.pi / 180
    lon2_rad = another_LatLon.lon * math.pi / 180
    lat_average_rad = (lat1_rad + lat2_rad) / 2
    lat_diff = lat1_rad - lat2_rad
    lon_diff = lon1_rad - lon2_rad

    #todo set these magic numbers to variable names
    meridian = (6335439.327 / ((1 - 0.006694379990 * math.sin(lat_average_rad) ** 2) ** 3) ** 0.5)
    prime_vertical = (6378137.000 / (1 - 0.006694379990 * math.sin(lat_average_rad) ** 2) ** 0.5)
    return (((meridian * lat_diff) ** 2 + (prime_vertical * math.cos(lat_average_rad) * lon_diff) ** 2) ** 0.5)