var util = require('util');
var fs = require('fs');
var path = require('path');
var rmdir = require('rimraf');
var request = require('request');
var ncp = require('ncp').ncp;
var async = require('async');

ncp.limit = 16;

var DEFAULT_PYEXEC = '#!/usr/bin/env python';
var DEFAULT_DIST = 'dist';

var LIB_SRC_DIR = 'python_libs';
var LIB_DIST_DIR = 'src/coralcgi/libs';

module.exports = function(grunt) {

  function distDir() {
    return grunt.option('dist') || DEFAULT_DIST;
  }

  var pypiHandlers = {
    load: function(pkg, done) {
      grunt.log.writeln(util.format('Loading package %s', pkg));
      var srcPath = path.join(LIB_SRC_DIR, pkg);
      var distPath = path.join(LIB_DIST_DIR, pkg);
      if (fs.existsSync(distPath)) {
        grunt.log.error(util.format('ERROR: %s already exists in %s'), pkg, LIB_DIST_DIR);
        grunt.fail.warn('Loading package failed.');
      } else if (fs.existsSync(srcPath) && fs.statSync(srcPath).isDirectory()) {
        ncp(srcPath, distPath, function(err) {
          if (err) {
            grunt.log.error(util.format('ERROR: %s'), err.message);
            grunt.fail.warn('Loading package failed.');
          } else {
            grunt.log.ok();
            done();
          }
        });
      } else {
        grunt.log.error(util.format('Package %s not found in %s.', pkg, LIB_SRC_DIR));
        grunt.fail.warn('Loading package failed.');
      }
    },
    unload: function(pkg) {
      var text = util.format('Unloading package %s', pkg);
      grunt.log.writeln(text);
      var pkgPath = path.join(LIB_DIST_DIR, pkg);
      if (fs.existsSync(pkgPath) && fs.statSync(pkgPath).isDirectory()) {
        rmdir.sync(pkgPath);
        grunt.log.ok();
      } else {
        var pkgtext = util.format('%s not loaded. View loaded packages ' + 
                                  'with pypi:list.', pkg);
        grunt.log.error(pkgtext);
        grunt.fail.warn('Unloading package failed.');
      }
    },
    list: function(pkg) {
      var files = fs.readdirSync(LIB_DIST_DIR);
      files = files.map(function(file) {
        return {'name': file, 'path': path.join(LIB_DIST_DIR, file)};
      }).filter(function(obj) {
        return fs.statSync(obj.path).isDirectory();
      });

      var text = util.format('%s PyPI package%s loaded in %s',
                             files.length,
                             files.length === 1 ? '' : 's',
                             LIB_DIST_DIR);
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
        files: [{
          expand: true,
          src: [
            'src/**/*.py',
            '!src/coralcgi/**/*.py',
            '!src/coralcgi/**/*.pyc'
          ]
        }],
        dest: distDir(),
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
            cwd: 'src/',
            src: ['**'],
            dest: distDir()
          }
        ]
      }
    },

    chmod: {
      execPyFiles: {
        options: {
          mode: '755'
        },
        src: [
            distDir() + '/**/*.py',
            '!' + distDir() + '/coralcgi/**/*.py',
            '!' + distDir() + '/coralcgi/**/*.pyc'
        ]
      },
      deExecLibFiles: {
        options: {
          mode: '644'
        },
        src: [
            distDir() + '/coralcgi/**/*.py',
            distDir() + '/coralcgi/**/*.pyc'
        ]
      }
    },

    watch: {
      files: ['src/**'],
      tasks: ['replace', 'copy', 'chmod']
    }
  });

  grunt.registerTask('cleardist', function() {
    grunt.log.writeln(util.format('Deleting contents of %s...', distDir()));
    fs.readdirSync(distDir()).forEach(function(rawFile) {
      file = path.join(distDir(), rawFile);
      if (fs.statSync(file).isDirectory()) {
        grunt.log.writeln(util.format(' D %s', file));
        rmdir.sync(file);
      } else {
        grunt.log.writeln(util.format(' F %s', file));
        fs.unlinkSync(file);
      }
    });
    grunt.log.ok();
  });

  grunt.registerTask('pypi', function(task, pkg) {
    if (task === 'load') {
      var allDone = this.async();
      async.series([
        function(done) {
          pypiHandlers.load(pkg, done);
        },
        function(done) {
          pypiHandlers.list();
          done();
        }
      ], function() {
        allDone();
      });
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

  grunt.registerTask('default', ['replace', 'cleardist', 'copy',
                                 'chmod:execPyFiles', 'chmod:deExecLibFiles']);

};
