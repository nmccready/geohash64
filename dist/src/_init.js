
/*
  load with utf-8 encoding!!!!!!!!!!!!
 */

(function() {
  var getGlobal, _global;

  getGlobal = function() {
    if (isNode) {
      return global;
    } else {
      return window;
    }
  };

  _global = getGlobal();

  _global.getGlobal = getGlobal;

  _global.isNode = isNode;

  if (isNode) {
    _global.bigint = require('bigint');
    _global.base64 = require('base-64');
    _global._ = require('lodash');
    _global.ns2 = require('ns2');
    _global.namespace = ns2.namespace;
  }

  namespace('geohash64');


  /*
   * base64url characters
   */

  _global.geohash64 = (function() {
    var codeMap, i, indexStr, _i, _ref;
    indexStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    codeMap = {};
    for (i = _i = 0, _ref = indexStr.length; _i <= _ref; i = _i += 1) {
      codeMap[indexStr[i]] = i;
    }
    return {
      codeMap: codeMap,
      indexStr: indexStr
    };
  })();

  _global.float2int = function(value) {
    return value | 0;
  };

}).call(this);
