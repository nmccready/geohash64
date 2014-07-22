###
  load with utf-8 encoding!!!!!!!!!!!!
###
getGlobal = ->
  if isNode then global else window

#put into global scope
_global = getGlobal()
_global.getGlobal = getGlobal
_global.isNode = isNode

if isNode
  _global.bigint = require 'bigint'
  _global.base64 = require 'base-64'
#  math = require 'math'
  _global.ns2 = require 'ns2'
  _global.namespace = ns2.namespace

namespace 'geohash64.Base64Map'

###############################################################################
# base64url character
###############################################################################
geohash64.Base64Map = do ->
  base64Str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
  base64Map = {}
  for i in [0..base64Str.length] by 1
    base64Map[base64Str[i]] = i
  base64Str: base64Str
  base64Map: base64Map

_global.float2int = (value) ->
  value | 0