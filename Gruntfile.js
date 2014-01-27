module.exports = function(grunt) {

var DEFAULT_ENV = '#!/usr/bin/env python';

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    replace: {
      main: {
        src: ['src/*.py'],
        dest: 'dist/',
        replacements: [{ 
          from: DEFAULT_ENV,
          to: grunt.option('pyexec') || DEFAULT_ENV
        }]
      }
    },
    
    copy: {
      main: {
        files: [
          {
            expand: true,
            src: ['src/coralcgi/**'],
            dest: 'dist/coralcgi/'
          }
        ]
      }
    }

  });

  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['replace', 'copy']);

};
