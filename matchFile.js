fs = require('fs');
path = require('path');

function matchFile(dir, match) {
  var x = [];
  function fn(f) {
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
  }
  x.operations = [];
  for (var f in matchFile.fn) {
    x[f] = fn(f);
  }
  return matchFile.chain(x, dir, match);
}

matchFile.fn = {};

if (typeof module === 'object') {
  module.exports = matchFile;
}

matchFile.chain = function (x, dir, match) {
  [].splice.apply(x, [0, x.length].concat(matchFile.find(dir, match)));
  x.match = match;
  return x;
};

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

matchFile.fn.filter = function (array, predicate) {
  var i = array.length - 1;

  for (; i >= 0; i--) {
    if (!predicate(array[i], i, array)) {
      array.splice(i, 1);
    }
  }

  return array;
};

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
    var match = path.basename(filename).match(array.match);
    var newName = toName.replace(/\$([a-zA-Z0-9]+)/g, function (x, y) {
      if (y === 'dir') {
        return path.dirname(filename);
      } else if (y === 'filename') {
        return path.basename(filename);
      } else if (!isNaN(Number(y))) {
        return match[Number(y)];
      }
    });
    fs.rename(filename, newName);
    array[i] = newName;
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

    if (aSplit.slice(0, -1) === 'scripts' && bSplit.slice(0, -1) === 'components') {
      return -1;
    } else if (bSplit.slice(0, -1) === 'scripts' && aSplit.slice(0, -1) === 'components') {
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
