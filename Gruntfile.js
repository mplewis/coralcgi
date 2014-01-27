module.exports = function(grunt) {

var DEFAULT_PYEXEC = '#!/usr/bin/env python';
var DEFAULT_DIST = 'dist/';

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    replace: {
      main: {
        src: ['src/*.py'],
        dest: grunt.option('dist') || DEFAULT_DIST,
        replacements: [{ 
          from: DEFAULT_PYEXEC,
          to: grunt.option('pyexec') || DEFAULT_PYEXEC
        }]
      }
    },
    
    copy: {
      main: {
        files: [
          {
            expand: true,
            src: ['src/coralcgi/**'],
            dest: (grunt.option('dist') || DEFAULT_DIST) + 'coralcgi/'
          }
        ]
      }
    }

  });

  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['replace', 'copy']);

};
