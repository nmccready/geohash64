
/*
  load with utf-8 encoding!!!!!!!!!!!!
 */
var float2int, geohash64, getGlobal, namespace, ns2, _;

getGlobal = function() {
  if (isNode) {
    return global;
  } else {
    return window;
  }
};

if (isNode) {
  _ = require('lodash');
  ns2 = require('ns2');
  namespace = ns2.namespace;
}

namespace('geohash64');


/*
 * base64url characters
 */

geohash64 = (function() {
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

float2int = function(value) {
  return value | 0;
};
