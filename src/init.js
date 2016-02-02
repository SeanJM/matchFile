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
