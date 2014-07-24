namespace 'geohash64'
###
  encode:
  arguments:
    latLonArray: an array or latLon(Array Objects) - ie: [[36,140.0]], where lat = 36, and lon = 140
    (precision): number of decimal place accuracy
    (encoder): a LatLon object type to use as the encoding object
###
geohash64.encode = (latLonArray, precision = 5, encoder = geohash64.GoogleLatLon)->
#  console.log "latLonArray: #{latLonArray}"
  throw new Error('One location pair must exist') unless latLonArray?.length
  allAreValid = _.all latLonArray, (latLon) ->
    latLon.length == 2
  throw new Error('All lat/lon objects are valid') unless allAreValid
  finalHash = ''
  latLonArray.forEach (ll) ->
    ll = new encoder(ll[0],ll[1])
    finalHash += ll.getGeoHash(precision).hash
  finalHash

geohash64.decode = (hash, doConvertToLatLonArrayOfArray, decoder = geohash64.GoogleHash64, type = 'geohash64.GoogleHash64')->
  hasher = new decoder(hash,true)
  points = hasher.hash2geo(doReturnPoints = true)
  return points if not doConvertToLatLonArrayOfArray
  points.map (latLon) ->
    [latLon.lat,latLon.lon]

module.exports =
  encode: geohash64.encode
  decode: geohash64.decode
  LatLon: geohash64.LatLon
  Coordinate: geohash64.Coordinate
  GeoHash64: geohash64.GeoHash64
  GoogleLatLon: geohash64.GoogleLatLon
  GoogleHash64: geohash64.GoogleHash64