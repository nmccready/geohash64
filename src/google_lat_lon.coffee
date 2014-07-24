###
  GoogleLatLon Class
  desc: hash implementation of https://developers.google.com/maps/documentation/utilities/polylinealgorithm in nodejs
  author: nick mccready
  notes:
    a way to play around in node
    working from https://developers.google.com/maps/documentation/utilities/polylinealgorithm
    (((((maybeFlip((rounded)<< 1))>>0) <<25>>25) & 0x1F)|0x20) + 63 = 96
    (((((maybeFlip((rounded)<< 1))>>5) <<20>>20) & 0x1F)|0x20) + 63 = 126
    (((((maybeFlip((rounded)<< 1))>>10)<<15>>15) & 0x1F)|0x20) + 63 = 111
    (((((maybeFlip((rounded)<< 1))>>15)<<10>>10) & 0x1F)|0x20) + 63 = 105
    (((((maybeFlip((rounded)<< 1))>>10)<<20>>20) & 0x1F)|0x20) + 63 = 111
    (((((maybeFlip((rounded)<< 1))>>20)  <<5>>5) & 0x1F)|0x20) + 63 = 97
    (((((maybeFlip((rounded)<< 1))>>25)  <<0>>0) & 0x1F)) + 63 = 64 (final no 5 bit chunks left no OR of 0x20)
###
namespace 'geohash64'
class geohash64.GoogleLatLon extends geohash64.LatLon
  toString: =>
    """geohash64.GoogleLatLon unit='degree'
    lat:#{@lat}, lon:#{@lon}
    """
  toEqual: (other) =>
    other.lat == @lat and other.lon == @lon

  maybeFlip: (value) ->
    if value < 0
      return ~value
    value

  rounded: (value) ->
    Math.round 1e5 * value

  #forcing only 5 bits
  mask: 0x1F #31 decimal
  chunkSize: 5

  #shamelessly copied from here : https://gist.github.com/signed0/2031157
  getChunks: (value) ->
    chunks = []
    while value >= 32
      do =>
        chunks.push (value & @mask) | 0x20
        value >>= @chunkSize
    chunks.push value
    chunks

  getGeoHash: (set) =>
    if !set
      set = [@lat, @lon]
    hash = ''
#    console.log "set: #{set}"
    set.map (coord) =>
      coord = @rounded(coord)
#      console.log "Rounded Coord: #{coord}"
      #step 2 & 4
      value = @maybeFlip coord << 1
#      console.log "After maybeflip:#{value}"
      #Step 5 - 8
      chunks = @getChunks value
      # Step 9-10
      chunks.forEach (c) ->
        asciiIndex = c + 63
#        console.log "asciiIndex: #{asciiIndex}"
        hashToAdd =  String.fromCharCode asciiIndex
#        console.log "hashToAdd: #{hashToAdd}"
        hash += hashToAdd
    return new geohash64.GoogleHash64(hash,@) #pass @ to not have to decode