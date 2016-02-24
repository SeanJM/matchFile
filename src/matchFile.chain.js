matchFile.chain = function (x, dir, match) {
  [].splice.apply(x, [0, x.length].concat(matchFile.find(dir, match)));
  x.match = match;
  return x;
};
