var MATCH_INIT = /^init\.[a-z]+$/;
var MATCH_EXECUTE = /^exe(cute|)\.[a-z]+$/;

var fs = require('fs');
var path = require('path');

function getMatch(dir, match) {
  var files = fs.readdirSync(dir);
  var list = [];

  files.forEach(function (name) {
    var filename = path.join(dir, name);
    var m;

    if (fs.lstatSync(filename).isDirectory()) {
      list = list.concat(getMatch(filename, match));
    } else if (match.test(name)) {
      m = name.match(match);

      if (m.length > 1) {
        m = m.slice(1);
      }

      list.push(filename);
    }
  });

  return list;
}


function sort(list) {
  return list.sort(function (a, b) {
    // Split
    var aSplit = a.split('.');
    var bSplit = b.split('.');

    // Dirname
    var aDir = path.dirname(a);
    var bDir = path.dirname(b);

    // Dirname split
    var aDSplit = aDir.split(path.sep);
    var bDSplit = bDir.split(path.sep);

    // Base name
    var aBase = path.basename(a);
    var bBase = path.basename(b);

    if (aDir === bDir) {
      if (MATCH_INIT.test(aBase)) {
        return -1;
      } else if (MATCH_INIT.test(bBase)) {
        return 1;
      } else if (MATCH_EXECUTE.test(aBase)) {
        return 1;
      } else if (MATCH_EXECUTE.test(bBase)) {
        return -1;
      } if (aSplit.length !== bSplit.length) {
        return aSplit.length - bSplit.length;
      }
    } else if (aDSplit.length !== bDSplit.length) {
      return aDSplit.length - bDSplit.length;
    }

    return a > b ? 1 : -1;
  });
}

function matchFile(dir, match) {
  return sort(getMatch(dir, match));
}

if (typeof module === 'object') {
  module.exports = matchFile;
}
