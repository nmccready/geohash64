
/*
  load with utf-8 encoding!!!!!!!!!!!!
 */

/*
 * base64url characters
 */
var all, chunkSize, decodeCoord, extend, float2int, geohash64, getChunks, mask, maybeFlip, ord, rounded;

geohash64 = (function() {
  var codeMap, i, indexStr, j, ref;
  indexStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  codeMap = {};
  for (i = j = 0, ref = indexStr.length; j <= ref; i = j += 1) {
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

extend = function(toExtend, extender) {
  var field, fieldName;
  for (fieldName in extender) {
    field = extender[fieldName];
    toExtend[fieldName] = field;
  }
  return toExtend;
};

all = function(coll, cb) {
  var k, pass, val;
  pass = true;
  for (k in coll) {
    val = coll[k];
    if (!cb(val)) {
      pass = false;
      break;
    }
  }
  return pass;
};

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
