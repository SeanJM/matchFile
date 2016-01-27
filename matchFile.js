fs = require('fs');
path = require('path');

function matchFile(dir, match) {
  return matchFile.chain(dir, match);
}

matchFile.fn = {};

if (typeof module === 'object') {
  module.exports = matchFile;
}

matchFile.fn.rename = function (fileList, toName) {
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
};

matchFile.fn.smartSort = function (fileList) {
  function getSortIndex(a, b) {
    var aDir = path.dirname(a);
    var bDir = path.dirname(b);
    var aFilename = path.basename(a);
    var bFilename = path.basename(b);
    var aChunk = aFilename.match(/[a-zA-Z0-9]+/g);
    var bChunk = bFilename.match(/[a-zA-Z0-9]+/g);
    if (aDir === bDir) {
      if (/^init\.[a-z]+$/.test(aFilename)) {
        return 1;
      } else if (/^init\.[a-z]+$/.test(bFilename)) {
        return -1;
      } else if (aChunk.length > bChunk.length) {
        return 1;
      } else if (aChunk.length < bChunk.length) {
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

(function () {
  var fileList = [];
  matchFile.chain = function (dir, match) {
    fileList.splice(0);
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
    return fileList;
  }
  for (var f in matchFile.fn) {
    fileList[f] = function (f) {
      return function () {
        matchFile.fn[f].apply(null, [fileList].concat([].slice.call(arguments)));
        return fileList;
      };
    }(f);
  }
}());
