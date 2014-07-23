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
  _global._ = require 'lodash'
  #  math = require 'math'
  _global.ns2 = require 'ns2'
  _global.namespace = ns2.namespace

namespace 'geohash64'
###
# base64url characters
###
_global.geohash64 = do ->
  indexStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
  codeMap = {}
  for i in [0..indexStr.length] by 1
    codeMap[indexStr[i]] = i
  codeMap: codeMap
  indexStr: indexStr

_global.float2int = (value) ->
  value | 0