# MatchFile
A JavaScript utility for NodeJS to match files.

### Smart Sort

Will sort the files based on file name length so that `filename.js` comes before `filename.aMethod.js` in the array.

```javascript
matchFile('dir/', /\.js$/).smartSort();
```

### Rename

Will rename the array of files based on a string value.

```javascript
matchFile('dir/', /myFile\.([a-zA-Z]+).js$/).rename('$dir/newFile.$1.js');
```
