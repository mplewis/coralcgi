var util = require('util');
var fs = require('fs');
var path = require('path');
var rmdir = require('rimraf');

var DEFAULT_PYEXEC = '#!/usr/bin/env python';
var DEFAULT_DIST = 'dist/';

var LIB_DIR = 'src/coralcgi/libs';

module.exports = function(grunt) {

  var pypiHandlers = {
    load: function(pkg, ver) {
      var text;
      if (ver)
        text = util.format('Loading package %s, version %s', pkg, ver);
      else
        text = util.format('Loading package %s', pkg);
      grunt.log.writeln(text);
      grunt.fail.warn('Loading package failed.');
    },
    unload: function(pkg) {
      var text = util.format('Unloading package %s', pkg);
      grunt.log.writeln(text);
      var pkgpath = path.join(LIB_DIR, pkg);
      if (fs.existsSync(pkgpath) && fs.statSync(pkgpath).isDirectory()) {
        grunt.fail.warn('Package exists but unloading is not yet implemented. ' +
                        'Unloading package failed.');
      } else {
        grunt.fail.warn('Package not loaded: view loaded packages with pypi:list. ' + 
                        'Unloading package failed.');
      }
    },
    list: function(pkg) {
      var text = util.format('PyPI packages loaded in %s:', LIB_DIR);
      grunt.log.writeln(text);
      var files = fs.readdirSync(LIB_DIR);
      files.map(function(file) {
        return {'name': file,
                'path': path.join(LIB_DIR, file)};
      }).filter(function(obj) {
        return fs.statSync(obj.path).isDirectory();
      }).forEach(function(obj) {
        grunt.log.writeln(' - ' + obj.name);
      });
    }
  };

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

  grunt.registerTask('pypi', function(task, pkg, ver) {
    if (task === 'load')
      pypiHandlers.load(pkg, ver);
    else if (task === 'unload')
      pypiHandlers.unload(pkg);
    else if (task === 'list')
      pypiHandlers.list();
    else {
      grunt.fail.warn('pypi command not recognized: use load, unload, or list.');
    }
  });

  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-chmod');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['replace', 'copy', 'chmod']);

};