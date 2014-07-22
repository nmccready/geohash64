module.exports =
  encode: (latLonArray, precision = 10)->
    throw new Error('One location pair must exist') unless latLonArray?.length
    allAreValid = _(latLonArray).all (latLon) ->
      latLon.getGeoHash64? and latLon.lat? and latLon.lon? and typeof latLon == 'geohash64.GeoHash64'
    throw new Error('All lat/lon objects are valid') unless allAreValid
    finalHash = ''
    ctr = 0
    latLonArray.forEach (ll) ->
      append = if ctr > 0 then ',' else ''
      finalHash = ll.getGeoHash64(precision).hash + append
      ctr += 1
    finalHash

  decode: (hash,doParseComma)->
    _dcode: (hash)->
      new GeoHash64(hash).center_ll
    unless doParseComma
      return [_dcode hash]
    hashArray = hash.split(',')
    hashArray.map (hash) ->
      _dcode hash