function matchFile(dir, match, callback) {
  var files = fs.readdirSync(dir);
  files.forEach(function (fileName) {
    var path = dir + fileName;
    var m;
    if (fs.lstatSync(path).isDirectory()) {
      matchFile(path + '/', match, callback);
    } else if (match.test(fileName)) {
      m = fileName.match(match);
      if (m.length > 1) {
        m = m.slice(1);
      }
      callback({
        fullpath : dir + fileName,
        dir : dir,
        filename : fileName,
        rename : function (toName) {
          fs.rename(dir + fileName, toName.replace(/\$([a-zA-Z0-9]+)/g, function (x, y) {
            if (y === 'dir') {
              return dir;
            } else if (y === 'filename') {
              return filename;
            } else if (!isNaN(Number(y))) {
              return m[Number(y + 1)];
            }
          }));
        }
      });
    }
  });
}
