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
            cwd: 'src/coralcgi/',
            src: ['**'],
            dest: (grunt.option('dist') || DEFAULT_DIST) + 'coralcgi/'
          }
        ]
      }
    },

    chmod: {
      options: {
        mode: '755'
      },
      main: {
        src: (grunt.option('dist') || DEFAULT_DIST) + '*.py'
      }
    },

    watch: {
      files: ['src/**'],
      tasks: ['replace', 'copy', 'chmod']
    }

  });

  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-chmod');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['replace', 'copy', 'chmod']);

};
