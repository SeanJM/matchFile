# MatchFile
A JavaScript utility for NodeJS to match files.

### Smart Sort

Will sort the files based on file name length so that `filename.js` comes before `filename.aMethod.js` in the array.

Before

```javascript
[
  'src/init.js',
  'src/matchFile.fn.rename.js',
  'src/matchFile.fn.smartSort.js',
  'src/matchFile.js'
]
```

```javascript
matchFile('dir/', /\.js$/).smartSort();
```

After

```javascript
[
  'src/matchFile.js',
  'src/matchFile.fn.rename.js',
  'src/matchFile.fn.smartSort.js',
  'src/init.js'
]
```

### Rename

Will rename the array of files based on a string value.

For example:

Before

```javascript
[
  'src/init.js',
  'src/matchFile.fn.rename.js',
  'src/matchFile.fn.smartSort.js',
  'src/matchFile.js'
]
```

```javascript
matchFile('src/', /matchFile\.fn\.([a-zA-Z]+).js$/).rename('$dir/matchFile.function.$1.js');
```

After

```javascript
[
  'src/init.js',
  'src/matchFile.function.rename.js',
  'src/matchFile.function.smartSort.js',
  'src/matchFile.js'
]
```
