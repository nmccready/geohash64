pkg = require '../package.json'

###
  encode:
  arguments:
    latLonArray: an array or latLon(Array Objects) - ie: [[36,140.0]], where lat = 36, and lon = 140
    (precision): number of decimal place accuracy
    (encoder): a LatLon object type to use as the encoding object
###
_encode = (latLonArray, precision = 5, encoder = GoogleLatLon)->
#  console.log "latLonArray: #{latLonArray}"
  throw new Error('One location pair must exist') unless latLonArray?.length
  allAreValid = _.all latLonArray, (latLon) ->
    latLon.length == 2
  throw new Error('All lat/lon objects are valid') unless allAreValid
  finalHash = ''
  previous = undefined
  latLonArray.forEach (array) ->
    # console.info "array: " + array
    # console.info "previous: " + previous
    latLon = new encoder(array,previous)
    previous = array
    finalHash += latLon.getGeoHash(precision).hash
  finalHash

_decode = (hash, doConvertToLatLonArrayOfArray, decoder = GoogleHash64, type = 'GoogleHash64')->
  hasher = new decoder(hash, true)
  points = hasher.hash2geo(doReturnPoints = true)
  return points if not doConvertToLatLonArrayOfArray
  points.map (latLon) ->
    [latLon.lat, latLon.lon]

module.exports =
  encode: _encode
  decode: _decode
  encodeZoom: (intNum) ->
    GoogleCoder.encode intNum, isZoom = true
  decodeZoom: (hash) ->
    GoogleCoder.decode hash, isZoom = true, isSingle = true

  LatLon: LatLon
  Coordinate: Coordinate
  GeoHash64: GeoHash64
  GoogleLatLon: GoogleLatLon
  GoogleHash64: GoogleHash64
  GoogleCoder: GoogleCoder
  name: pkg.name
  version: pkg.version
