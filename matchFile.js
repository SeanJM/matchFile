fs = require('fs');
path = require('path');

function matchFile(dir, match) {
  return matchFile.chain(dir, match);
}

matchFile.fn = {};

if (typeof module === 'object') {
  module.exports = matchFile;
}

matchFile.fn.pipe = function (x, dir, match) {
  var pipeList = matchFile.find(dir, match);
  var f;
  var a;
  for (var i = 0, n = x.operations.length; i < n; i++) {
    f = matchFile.fn[x.operations[i].name];
    a = x.operations[i].arguments;
    pipeList = f.apply(null, [pipeList].concat(a));
  }
  return pipeList;
};

matchFile.fn.rename = function (array, toName) {
  array.forEach(function (filename, i) {
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
  return array;
};

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

(function () {
  var x = [];
  x.operations = [];
  matchFile.find = function (dir, match) {
    var list = [];
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
          list.push(filename);
        }
      });
    }
    getMatch(dir);
    return list;
  };
  matchFile.chain = function (dir, match) {
    [].splice.apply(x, [0, x.length].concat(matchFile.find(dir, match)));
    return x;
  }
  for (var f in matchFile.fn) {
    x[f] = function (f) {
      return function () {
        var a = matchFile.fn[f].apply(null, [x].concat([].slice.call(arguments)));
        if (f === 'pipe') {
          x.push.apply(x, a);
        } else {
          x.operations.push({
            name : f,
            arguments : [].slice.call(arguments)
          });
          [].splice.apply(x, [0, x.length].concat(a));
        }
        return x;
      };
    }(f);
  }
}());
