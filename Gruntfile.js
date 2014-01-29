var util = require('util');
var fs = require('fs');
var path = require('path');
var rmdir = require('rimraf');
var request = require('request');

var DEFAULT_PYEXEC = '#!/usr/bin/env python';
var DEFAULT_DIST = 'dist/';

var LIB_DIR = 'src/coralcgi/libs';

var PYPI_PKG = 'http://pypi.python.org/pypi/%s/json';
var PYPI_PKG_VER = 'http://pypi.python.org/pypi/%s/%s/json';

var pypiApi = {
  info: function(pkg, ver, callback) {
    if (!ver) {   
      var url = util.format(PYPI_PKG, pkg);
      request(url, function(err, resp, body) {
        if (err)
          return callback(err);
        if (resp.statusCode !== 200)
          return callback(new Error(body));
        var info = JSON.parse(body);
        return callback(err, info);
      });
    }
  }
};

module.exports = function(grunt) {

  var pypiHandlers = {
    load: function(pkg, ver, done) {
      var text;
      if (ver)
        text = util.format('Loading package %s, version %s', pkg, ver);
      else
        text = util.format('Loading package %s', pkg);
      grunt.log.writeln(text);
      pypiApi.info(pkg, ver, function(err, info) {
        if (err) {
          grunt.log.error('Error: ' + err.message);
          grunt.fail.warn('Loading package failed.');
          done();
        } else {
          grunt.log.writeln(util.format('%s info:', pkg));
          grunt.log.writeln(util.format(' - Version:', info.info.version));
          done();
        }
      });
    },
    unload: function(pkg) {
      var text = util.format('Unloading package %s', pkg);
      grunt.log.writeln(text);
      var pkgpath = path.join(LIB_DIR, pkg);
      if (fs.existsSync(pkgpath) && fs.statSync(pkgpath).isDirectory()) {
        rmdir.sync(pkgpath);
        grunt.log.ok();
      } else {
        var pkgtext = util.format('%s not loaded. View loaded packages ' + 
                                  'with pypi:list.', pkg);
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
        src: ['src/**/*.py'],
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
      var done = this.async();
      pypiHandlers.load(pkg, ver, done);
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
