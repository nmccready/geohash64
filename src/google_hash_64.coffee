###############################################################################
# GoogleHash64 Class
###############################################################################
namespace 'geohash64'
class geohash64.GoogleHash64
  constructor: (@hash, @center_ll, @precision = 6) ->
    throw new Error 'Argument is invalid' unless _.isString @hash
    @hash2geo() unless @center_ll

  toString: =>
    """geohash64.GoogleHash64:
            hash: #{@hash},center_ll: #{@center_ll}"""

  ord: (str) ->
    str.charCodeAt(0)
  round: (value) ->
    value.toFixed(@precision)

  tuple: (left,right) ->
#    console.log "left: #{left}, right:#{right}"
    new geohash64.GoogleLatLon(left,right)
  mask: 0x1F #5bits
  #ported https://gist.github.com/signed0/2031157, thanks!
  hash2geo:(doReturnPoints = false) =>
    point_str = @hash
    '''Decodes a polyline that has been encoded using Google's algorithm
    http://code.google.com/apis/maps/documentation/polylinealgorithm.html

    This is a generic method that returns a list of (latitude, longitude)
    tuples.

    :param point_str: Encoded polyline string.
    :type point_str: string
    :returns: List of 2-tuples where each tuple is (latitude, longitude)
    :rtype: list

    '''
    # some coordinate offset is represented by 4 to 5 binary chunks
    coord_chunks = [[]]
    chunkSet = 0
    _(point_str).each (char)=>
#      console.log "char: #{char}"
      # convert each character to decimal from ascii
      value = @ord(char) - 63
#      console.log "char code: #{value}"
      # values that have a chunk following have an extra 1 on the left
      split_after = not (value & 0x20)
      value &= @mask
      coord_chunks[chunkSet].push value
      if split_after
        chunkSet += 1 #move on to next lat/lon
        coord_chunks.push []

    coord_chunks.pop()#last set is bogus
    coord_chunks.forEach (chunk,key) ->
#      console.log "coord #{key}: chunk val #{chunk}"
    coords = coord_chunks.map (coord_chunk) ->
      coord = 0
      coord_chunk.forEach (chunk,i) ->
        coord |= chunk << (i * 5)
      #there is a 1 on the right if the coord is negative
      if coord & 0x1
        coord = ~coord #invert
      coord >>= 1
      coord /= 100000.0
      coord

    # convert the 1 dimensional list to a 2 dimensional list and offsets to
    # actual values
    points = []
    prev_x = 0
    prev_y = 0

#    console.log "Coords: #{coords}"
#    console.log "Coords len: #{coords.length}"
    for i in [0...coords.length] by 2
      do (i) =>
#        console.log 'wtf'
        unless (coords[i] == 0 and coords[i + 1] == 0)
#          console.log "i: #{i}"
          prev_y += coords[i + 1]
          prev_x += coords[i]
          # a round to 6 digits ensures that the floats are the same as when
          # they were encoded
          @center_ll = @tuple @round(prev_x), @round(prev_y)
#          console.log "center_ll: #{@center_ll.toString()}"
          points.push @center_ll

    return points if doReturnPoints
    return @center_ll #conform to python geohash api
