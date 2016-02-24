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
