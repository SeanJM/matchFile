matchFile.fn.smartSort = function (array) {
  function sameChunk(aC, bC) {
    if (aC.length > 2 && aC.length === bC.length) {
      if (aC.slice(0, -2).join('') === bC.slice(0, -2).join('')) {
        if (aC.slice(-2)[0] === 'min') {
          return -1;
        }
        if (bC.slice(-2)[0] === 'min') {
          return 1;
        }
        if (aC.slice(-2).join('') > bC.slice(-2).join('')) {
          return 1;
        }
        if (aC.slice(-2).join('') < bC.slice(-2).join('')) {
          return -1;
        }
        return 0;
      }
    }
    if (aC.join('') > bC.join('')) {
      return 1;
    }
    return -1;
  }
  function getSortIndex(a, b) {
    var aDir = path.dirname(a);
    var bDir = path.dirname(b);
    var aFilename = path.basename(a);
    var bFilename = path.basename(b);
    var aC = aFilename.match(/[a-zA-Z0-9]+/g);
    var bC = bFilename.match(/[a-zA-Z0-9]+/g);
    if (aDir === bDir) {
      if (/^init\.[a-z]+$/.test(aFilename)) {
        return 1;
      }
      if (/^init\.[a-z]+$/.test(bFilename)) {
        return -1;
      }
      if (aC.length === bC.length) {
        return sameChunk(aC, bC);
      }
      if (aC.length > bC.length) {
        return 1;
      }
      if (aC.length < bC.length) {
        return -1;
      }
      if (aFilename > bFilename) {
        return 1;
      }
      return -1;
    } else if (aDir > bDir) {
      return 1;
    }
    return -1;
  }
  array.sort(function (a, b) {
    var aDirLength = a.split(path.sep).length;
    var bDirLength = b.split(path.sep).length;
    if (aDirLength !== bDirLength) {
      return aDirLength - bDirLength;
    }
    return getSortIndex(a, b);
  });
  return array;
};
