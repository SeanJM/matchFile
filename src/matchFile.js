const MATCH_INIT = /^init\.[a-z]+$/;
const MATCH_EXECUTE = /^exe(cute|)\.[a-z]+$/;
const MATCH_SPLIT = /\.|-/;

const fs = require('fs');
const path = require('path');

function getMatch(dir, match) {
  var list = [];
  try {
    fs.readdirSync(dir).forEach(function (name) {
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
  } catch (err) { } return list;
}


function sort(list) {
  return list.sort(function (a, b) {
    // Split
    var aSplit = a.split(MATCH_SPLIT);
    var bSplit = b.split(MATCH_SPLIT);

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
      }

      if (MATCH_INIT.test(bBase)) {
        return 1;
      }

      if (MATCH_EXECUTE.test(aBase)) {
        return 1;
      }

      if (MATCH_EXECUTE.test(bBase)) {
        return -1;
      }

      if (aSplit.length !== bSplit.length) {
        return aSplit.length - bSplit.length;
      }

      if (a > b) {
        return 1;
      } else {
        return -1;
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
