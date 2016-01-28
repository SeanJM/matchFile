(function () {
  var m = {
    value : [],
    operations : []
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
  }
  matchFile.chain = function (dir, match) {
    m.value = matchFile.find(dir, match);
    return m;
  }
  for (var f in matchFile.fn) {
    m[f] = function (f) {
      return function () {
        if (f === 'pipe') {
          m.value = matchFile.fn[f].apply(null, [m].concat([].slice.call(arguments)));
        } else {
          m.operations.push({
            name : f,
            arguments : [].slice.call(arguments)
          });
          m.value = matchFile.fn[f].apply(null, [m.value].concat([].slice.call(arguments)));
        }
        return m;
      };
    }(f);
  }
}());
