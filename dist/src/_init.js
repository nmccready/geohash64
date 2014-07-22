
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
    _global.ns2 = require('ns2');
    _global.namespace = ns2.namespace;
  }

  namespace('geohash64.Base64Map');

  geohash64.Base64Map = (function() {
    var base64Map, base64Str, i, _i, _ref;
    base64Str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    base64Map = {};
    for (i = _i = 0, _ref = base64Str.length; _i <= _ref; i = _i += 1) {
      base64Map[base64Str[i]] = i;
    }
    return {
      base64Str: base64Str,
      base64Map: base64Map
    };
  })();

  _global.float2int = function(value) {
    return value | 0;
  };

}).call(this);
