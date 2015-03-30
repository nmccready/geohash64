###
  load with utf-8 encoding!!!!!!!!!!!!
###

###
# base64url characters
###
geohash64 = do ->
  indexStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
  codeMap = {}
  for i in [0..indexStr.length] by 1
    codeMap[indexStr[i]] = i
  codeMap: codeMap
  indexStr: indexStr


###
  private (hidden) functions
###
float2int = (value) ->
  value | 0


decodeCoord = (coord) ->
  if coord & 0x1
    coord = ~coord #invert
  coord >>= 1
  coord /= 100000.0

maybeFlip = (value) ->
  if value < 0
    return ~value
  value

rounded = (value) ->
  Math.round 1e5 * value

#forcing only 5 bits
mask = 0x1F #31 decimal
chunkSize = 5

#shamelessly copied from here : https://gist.github.com/signed0/2031157
getChunks = (value) ->
  chunks = []
  while value >= 32
    do ->
      chunks.push (value & mask) | 0x20
      value >>= chunkSize
  chunks.push value
  #    console.log "Chunks Length: #{chunks.length}"
  chunks

ord = (str) ->
  str.charCodeAt(0)
