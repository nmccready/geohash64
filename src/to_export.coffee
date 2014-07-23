namespace 'geohash64'
geohash64.encode = (latLonArray, precision = 10)->
#  console.log "latLonArray: #{latLonArray}"
  throw new Error('One location pair must exist') unless latLonArray?.length
  allAreValid = _.all latLonArray, (latLon) ->
    latLon?.getGeoHash64? and latLon.lat? and latLon.lon?
  throw new Error('All lat/lon objects are valid') unless allAreValid
  finalHash = ''
  ctr = 0
  latLonArray.forEach (ll) ->
    append = if ctr > 0 then ',' else ''
    finalHash = ll.getGeoHash64(precision).hash + append
    ctr += 1
  finalHash

geohash64.decode = (hash, doParseComma)->
  _dcode = (hash)->
    new geohash64.GeoHash64(hash).center_ll
  unless doParseComma
    return [_dcode hash]
  hashArray = hash.split(',')
  hashArray.map (hash) ->
    _dcode hash

module.exports =
  encode: geohash64.encode
  decode: geohash64.decode
  LatLon: geohash64.LatLon
  Coordinate: geohash64.Coordinate
  GeoHash64: geohash64.GeoHash64