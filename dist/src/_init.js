
/*
  load with utf-8 encoding!!!!!!!!!!!!
 */
var chunkSize, decodeCoord, float2int, geohash64, getChunks, getGlobal, mask, maybeFlip, namespace, ns2, ord, rounded, _;

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


/*
  private (hidden) functions
 */

float2int = function(value) {
  return value | 0;
};

decodeCoord = function(coord) {
  if (coord & 0x1) {
    coord = ~coord;
  }
  coord >>= 1;
  return coord /= 100000.0;
};

maybeFlip = function(value) {
  if (value < 0) {
    return ~value;
  }
  return value;
};

rounded = function(value) {
  return Math.round(1e5 * value);
};

mask = 0x1F;

chunkSize = 5;

getChunks = function(value) {
  var chunks;
  chunks = [];
  while (value >= 32) {
    (function() {
      chunks.push((value & mask) | 0x20);
      return value >>= chunkSize;
    })();
  }
  chunks.push(value);
  return chunks;
};

ord = function(str) {
  return str.charCodeAt(0);
};
