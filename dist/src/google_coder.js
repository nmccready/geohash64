
/*
 NOTE in testing this library against google; you are only garunteed to get matches
 (encded hash to decoded points) for up to 5 decimals of accuracy. Therefore if you
 play with the Google Widget only encode lat lons with 5 decimals max.

 https://google-developers.appspot.com/maps/documentation/utilities/polylineutility_63b1683dd5bb00fea0eb2d1356fa8a61.frame?hl=en
 */
var GoogleCoder;

GoogleCoder = {
  encode: function(value, isZoom) {
    var chunks, hash;
    hash = '';
    if (!isZoom) {
      value = rounded(value);
    }
    if (!isZoom) {
      value = maybeFlip(value << 1);
    }
    chunks = getChunks(value);
    chunks.forEach(function(c) {
      var asciiIndex, hashToAdd;
      asciiIndex = c + 63;
      hashToAdd = String.fromCharCode(asciiIndex);
      return hash += hashToAdd;
    });
    return hash;
  },
  decode: function(hash, isZoomLevel, isSingle) {
    var chunkSet, coord_chunks, coords;
    coord_chunks = [[]];
    chunkSet = 0;
    _.each(hash, function(char) {
      var split_after, value;
      value = ord(char) - 63;
      split_after = !(value & 0x20);
      value &= mask;
      coord_chunks[chunkSet].push(value);
      if (split_after) {
        chunkSet += 1;
        return coord_chunks.push([]);
      }
    });
    coord_chunks.pop();
    coords = coord_chunks.map(function(coord_chunk) {
      var coord;
      coord = 0;
      coord_chunk.forEach(function(chunk, i) {
        return coord |= chunk << (i * 5);
      });
      if (!isZoomLevel) {
        coord = decodeCoord(coord);
      }
      return coord;
    });
    if (isSingle) {
      return coords[0];
    }
    return coords;
  },
  round: function(value, precision) {
    return value.toFixed(precision);
  },
  tuple: function(left, right, factory) {
    if (factory == null) {
      factory = GoogleLatLon;
    }
    return new factory(left, right);
  }
};
