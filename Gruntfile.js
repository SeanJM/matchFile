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
          'matchFile.min.js': [ 'src/matchFile.js', 'src/matchFile.fn.*.js', 'src/init.js' ],
        }
      }
    },
    concat: {
      options: {
        sourceMap: false,
        mangle: true
      },
      main : {
        files: {
          'matchFile.js': [ 'src/matchFile.js', 'src/matchFile.find.js', 'src/matchFile.fn.*.js', 'src/init.js' ],
        }
      }
    },
    watch: {
      main : {
        files: [ 'src/matchFile.js', 'src/matchFile.fn.*.js', 'last.js' ],
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
  grunt.registerTask('default', ['uglify', 'concat', 'watch']);
};
