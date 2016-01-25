var js = {};
(function () {
  var lib = {
    main : [ 'matchFile.js' ]
  };
  function get(files) {
    var arr = [];
    for (var i = 0, n = files.length; i < n; i++) {
      arr = arr.concat(lib[files[i]]);
    }
    return arr;
  }
  js.main = get([ 'main' ]);
})();
module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        sourceMap: false,
        mangle: true
      },
      main : {
        files: {
          'matchFile.min.js': js.main,
        }
      }
    },
    watch: {
      main : {
        files: js.main,
        tasks: ['uglify:main'],
        options: {}
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  // Default task(s).
  grunt.registerTask('default', ['uglify', 'watch']);
};
