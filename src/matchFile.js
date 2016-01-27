fs = require('fs');
path = require('path');

function matchFile(dir, match) {
  return matchFile.chain(dir, match);
}

matchFile.fn = {};

if (typeof module === 'object') {
  module.exports = matchFile;
}
