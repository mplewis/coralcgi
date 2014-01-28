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
        rmdir.sync(pkgpath);
        grunt.log.ok();
      } else {
        var pkgtext = util.format('%s not loaded. View loaded packages with pypi:list.', pkg);
        grunt.log.error(pkgtext);
        grunt.fail.warn('Unloading package failed.');
      }
    },
    list: function(pkg) {
      var files = fs.readdirSync(LIB_DIR);
      files = files.map(function(file) {
        return {'name': file,
                'path': path.join(LIB_DIR, file)};
      }).filter(function(obj) {
        return fs.statSync(obj.path).isDirectory();
      });

      var text = util.format('%s PyPI package(s) loaded in %s',
                             files.length, LIB_DIR);
      grunt.log.writeln(text);
      files.forEach(function(obj) {
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
    if (task === 'load') {
      pypiHandlers.load(pkg, ver);
    } else if (task === 'unload') {
      pypiHandlers.unload(pkg);
      pypiHandlers.list();
    } else if (task === 'list') {
      pypiHandlers.list();
    } else {
      grunt.fail.warn('pypi command not recognized: use load, unload, or list.');
    }
  });

  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-chmod');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['replace', 'copy', 'chmod']);

};
