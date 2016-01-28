matchFile.fn.pipe = function (m, dir, match) {
  var pipeList = matchFile.find(dir, match);
  var f;
  var a;
  for (var i = 0, n = m.operations.length; i < n; i++) {
    f = matchFile.fn[m.operations[i].name];
    a = m.operations[i].arguments;
    m.value = m.value.concat(f.apply(null, [pipeList].concat(a)));
  }
  return m.value;
};
