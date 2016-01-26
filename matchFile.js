fs = require('fs');
path = require('path');

function matchFile(dir, match, callback) {
  var fileList = [];
  fileList.smartSort = function () {
    function getSortIndex(a, b) {
      var aDir = path.dirname(a);
      var bDir = path.dirname(b);
      var aFilename = path.basename(a);
      var bFilename = path.basename(b);
      if (aDir === bDir) {
        if (aFilename.length > bFilename.length) {
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
    return fileList;
  };
  fileList.rename = function (toName) {
    fileList.forEach(function (filename, i) {
      var newName = toName.replace(/\$([a-zA-Z0-9]+)/g, function (x, y) {
        if (y === 'dir') {
          return path.dirname(y);
        } else if (y === 'filename') {
          return path.basename(y);
        } else if (!isNaN(Number(y))) {
          return m[Number(y + 1)];
        }
      });
      fs.rename(filename, newName);
      fileObject[i] = newName;
    });
    return fileList;
  };
  function getMatch(dir) {
    var files = fs.readdirSync(dir);
    files.forEach(function (name) {
      var filename = path.join(dir, name);
      var m;
      if (fs.lstatSync(filename).isDirectory()) {
        getMatch(filename);
      } else if (match.test(name)) {
        m = name.match(match);
        if (m.length > 1) {
          m = m.slice(1);
        }
        fileList.push(filename);
      }
    });
  }
  getMatch(dir);
  if (typeof callback === 'function') {
    callback();
  }
  return fileList;
}

if (typeof module === 'object') {
  module.exports = matchFile;
}
