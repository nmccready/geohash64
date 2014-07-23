###############################################################################
# GoogleLatLon Class
# hash implementation of https://developers.google.com/maps/documentation/utilities/polylinealgorithm in nodejs
# author: nick mccready
###############################################################################
namespace 'geohash64'
class geohash64.GoogleLatLon extends geohash64.LatLon
  totalBits = 30
  toString: =>
    """geohash64.GoogleLatLon unit='degree'
    lat:#{@lat}, lon:#{@lon},
    """
  maybeFlip: (value) ->
    if value < 0
      return ~value
    value

  rounded: (value) ->
    Math.round(Math.pow(10, 5) * value)

  #forcing only 5 bits
  mask: 0x1F
  len: totalBits #magic 25

  getGeoHash: (set) =>
    if !set
      set = [@lat, @lon]
    hash = ''
    set = set.map (v) =>
      @maybeFlip(@rounded(v) << 1)
    ###
      working from https://developers.google.com/maps/documentation/utilities/polylinealgorithm
      (((((maybeFlip((rounded)<< 1))>>0) <<25>>25) & 0x1F)|0x20) + 63 = 96
      (((((maybeFlip((rounded)<< 1))>>5) <<20>>20) & 0x1F)|0x20) + 63 = 126
      (((((maybeFlip((rounded)<< 1))>>10)<<15>>15) & 0x1F)|0x20) + 63 = 111
      (((((maybeFlip((rounded)<< 1))>>15)<<10>>10) & 0x1F)|0x20) + 63 = 105
      (((((maybeFlip((rounded)<< 1))>>10)<<20>>20) & 0x1F)|0x20) + 63 = 111
      (((((maybeFlip((rounded)<< 1))>>20)  <<5>>5) & 0x1F)|0x20) + 63 = 97
      (((((maybeFlip((rounded)<< 1))>>25)  <<0>>0) & 0x1F)) + 63 = 64 (final no 5 bit chunks left no OR of 0x20)
    ###
    #in reverse
    increment = 5
    console.log "set: #{set}"
    set.forEach (coord) =>
      console.log "Coord: #{coord}"
      for i in [0...@len] by increment
        console.log "i: #{i}"
        do(i) =>
          toOr = if i + increment != @len then 0x20 else 0
          index = (((((coord) >> i) << @len - i >> @len - i) & @mask) | toOr) + 63
          console.log index
          hash += String.fromCharCode index

#    return new geohash64.GeoHash64(hash)
    return hash