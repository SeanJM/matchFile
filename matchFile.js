fs = require('fs');

function matchFile(dir, match, callback) {
  var fileList = [];
  fileList.smartSort = function () {
    function getSortIndex(a, b) {
      var aDir = a.dir.split(/\/|\\/).slice(0, -1).join('/');
      var bDir = b.dir.split(/\/|\\/).slice(0, -1).join('/');
      var aFilename = a.filename.match(/[a-zA-Z0-9]+/g);
      var bFilename = b.filename.match(/[a-zA-Z0-9]+/g);
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
      var aDirLength = a.dir.split(/\/|\\/).length;
      var bDirLength = b.dir.split(/\/|\\/).length;
      if (aDirLength !== bDirLength) {
      	return aDirLength - bDirLength;
      } else {
      	return getSortIndex(a, b);
      }
    });
    return fileList;
  };
  fileList.rename = function (toName) {
    fileList.forEach(function (fileObject, i) {
      var newName = toName.replace(/\$([a-zA-Z0-9]+)/g, function (x, y) {
        if (y === 'dir') {
          return dir;
        } else if (y === 'filename') {
          return filename;
        } else if (!isNaN(Number(y))) {
          return m[Number(y + 1)];
        }
      });
      fs.rename(fileObject.fullpath, newName);
      fileObject[i].fullpath = newName;
      fileObject[i].dir = newName.split(/\/|\\/g).slice(0, -1).join('/');
      fileObject[i].filename = newName.split(/\/|\\/g).slice(-1)[0];
    });
    return fileList;
  };
  fileList.value = function () {
    return fileList.map(function (a) {
      return a.fullpath;
    });
  };
  function getMatch(dir) {
    var files = fs.readdirSync(dir);
    files.forEach(function (fileName) {
      var path = dir + fileName;
      var m;
      if (fs.lstatSync(path).isDirectory()) {
        getMatch(path + '/');
      } else if (match.test(fileName)) {
        m = fileName.match(match);
        if (m.length > 1) {
          m = m.slice(1);
        }
        fileList.push({
          fullpath : dir + fileName,
          dir : dir,
          filename : fileName,
        });
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
