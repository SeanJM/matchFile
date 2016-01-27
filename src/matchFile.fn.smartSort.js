matchFile.fn.smartSort = function (fileList) {
  function getSortIndex(a, b) {
    var aDir = path.dirname(a);
    var bDir = path.dirname(b);
    var aFilename = path.basename(a);
    var bFilename = path.basename(b);
    if (aDir === bDir) {
      if (/^init\.[a-z]+$/.test(aFilename)) {
        return 1;
      } else if (/^init\.[a-z]+$/.test(bFilename)) {
        return -1;
      } else if (aFilename.length > bFilename.length) {
        return 1;
      } else if (aFilename.length < bFilename.length) {
        return -1;
      } else if (a.filename > b.filename) {
        return 1;
      } else {
        return -1;
      }
    } else if (aDir > bDir) {
      return 1;
    } else {
      return -1;
    }
  }
  fileList.sort(function (a, b) {
    var aDirLength = a.split(path.sep).length;
    var bDirLength = b.split(path.sep).length;
    if (aDirLength !== bDirLength) {
      return aDirLength - bDirLength;
    } else {
      return getSortIndex(a, b);
    }
  });
};
