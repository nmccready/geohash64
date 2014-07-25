###############################################################################
# GoogleHash64 Class
###############################################################################
namespace 'geohash64'
class geohash64.GoogleHash64 extends ns2.BaseObject
  @include geohash64.GoogleCoder
  constructor: (@hash, @center_ll, @precision = 6) ->
    throw new Error 'Argument is invalid' unless _.isString @hash
    @hash2geo() unless @center_ll

  toString: =>
    """geohash64.GoogleHash64:
            hash: #{@hash},center_ll: #{@center_ll}"""

  #ported https://gist.github.com/signed0/2031157, thanks!
  hash2geo:(doReturnPoints = false) =>
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
    coords = @decode @hash
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
          @center_ll = @tuple @round(prev_x,@precision), @round(prev_y,@precision)
#          console.log "center_ll: #{@center_ll.toString()}"
          points.push @center_ll
        prev_x = 0 #reset the crap
        prev_y = 0

    return points if doReturnPoints
    return @center_ll #conform to python geohash api
