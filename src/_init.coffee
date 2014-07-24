###
  load with utf-8 encoding!!!!!!!!!!!!
###
getGlobal = ->
  if isNode then global else window

if isNode
  _ = require 'lodash'
  #  math = require 'math'
  ns2 = require 'ns2'
  namespace = ns2.namespace

namespace 'geohash64'
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

float2int = (value) ->
  value | 0