matchFile.fn.pipe = function (x, dir, match) {
  var pipeList = matchFile.find(dir, match);
  var f;
  var a;
  for (var i = 0, n = x.operations.length; i < n; i++) {
    f = matchFile.fn[x.operations[i].name];
    a = x.operations[i].arguments;
    pipeList = f.apply(null, [pipeList].concat(a));
  }
  return pipeList;
};
