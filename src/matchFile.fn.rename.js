matchFile.fn.rename = function (array, toName) {
  array.forEach(function (filename, i) {
    var newName = toName.replace(/\$([a-zA-Z0-9]+)/g, function (x, y) {
      if (y === 'dir') {
        return path.dirname(y);
      } else if (y === 'filename') {
        return path.basename(y);
      } else if (!isNaN(Number(y))) {
        return m[Number(y + 1)];
      }
    });
    fs.rename(filename, newName);
    fileObject[i] = newName;
  });
  return array;
};
