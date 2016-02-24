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
