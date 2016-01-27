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
