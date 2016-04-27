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
        if (aC.slice(-2)[0] === 'mobile') {
          return 1;
        }
        if (bC.slice(-2)[0] === 'mobile') {
          return -1;
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
  function getSameDirSortIndex(a, b) {
    var aFilename = path.basename(a);
    var bFilename = path.basename(b);
    var aC = aFilename.match(/[a-zA-Z0-9]+/g);
    var bC = bFilename.match(/[a-zA-Z0-9]+/g);
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
  }
  function getDifferentDirSortIndex(a, b) {
    var aSplit = a.split(path.sep);
    var bSplit = b.split(path.sep);

    if (aSplit.slice(-2)[0] === 'scripts' && bSplit.slice(aSplit.length - 2)[0] === 'components') {
      return -1;
    } else if (bSplit.slice(-2)[0] === 'scripts' && aSplit.slice(bSplit.length - 2)[0] === 'components') {
      return 1;
    }

    if (aSplit.slice(0, -2).join(path.sep) === bSplit.slice(0, -1).join(path.sep)) {
      return 1;
    } else if (aSplit.slice(0, -1).join(path.sep) === bSplit.slice(0, -2).join(path.sep)) {
      return -1;
    } else if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    }
  }
  array.sort(function (a, b) {
    if (path.dirname(a) === path.dirname(b)) {
      return getSameDirSortIndex(a, b);
    } else {
      return getDifferentDirSortIndex(a, b);
    }
  });
  return array;
};
