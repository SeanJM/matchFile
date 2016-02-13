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
