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
  @include geohash64.GoogleCoder
  toString: =>
    """geohash64.GoogleLatLon unit='degree'
    lat:#{@lat}, lon:#{@lon}
    """
  toEqual: (other) =>
    other.lat == @lat and other.lon == @lon

  getGeoHash: (precision,set) =>
    if !set
      set = [@lat, @lon]
    hash = ''
#    console.log "set: #{set}"
    set.map (coord) =>
      hash += @encode coord
    return new geohash64.GoogleHash64(hash,@) #pass @ to not have to decode