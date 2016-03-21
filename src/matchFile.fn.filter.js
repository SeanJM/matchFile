matchFile.fn.filter = function (array, predicate) {
  var i = array.length - 1;

  for (; i >= 0; i--) {
    if (!predicate(array[i], i, array)) {
      array.splice(i, 1);
    }
  }

  return array;
};
