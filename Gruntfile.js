module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-ngmin');

  var userConfig = require('./package');

  var gruntConfig = {
    clean: {
      build: ['build'],
      tmp: ['tmp']
    },
    watch: {
      options: {
        spawn: false
      },
      // TODO: only copy changed files
      tests: {
        files: ['src/app/**/*.js'],
        tasks: ['copy:dev', 'karma:unit:run', 'notify:watch'],
      },
      // TODO: only copy changed files
      templates: {
        files: ['src/app/**/*.html'],
        tasks: ['html2js', 'copy:dev', 'notify:watch'],
      },
      // will refresh browser
      changes: {
        files: [
          'build/app/**/*'
        ],
        tasks: 'notify:watch',
        options: {
          livereload: true
        }
      },
      // will not refresh browser
      less: {
        files: 'src/less/**/*.less',
        tasks: ['less:dev', 'notify:watch'],
        options: {
          livereload: true
        }
      },
      index: {
        files: 'src/index.html',
        tasks: 'index:app',
        options: {
          livereload: true
        }
      }
    },

    copy: {
      dev: {
        expand: true,
        cwd: 'src/',
        src: ['app/**/*.js'],
        dest: 'build/'
      },
      vendor: {
        src: ['<%= vendorFiles %>'],
        dest: 'build/'
      },
      testVendor: {
        src: ['<%= testFiles %>'],
        dest: 'build/'
      },
      assets: {
        cwd: 'src/assets',
        expand: true,
        src: '**',
        dest: 'build/'
      }
    },

    index: {
      spec: {
        cwd: 'src/',
        src: ['app/**/*.js']
      },
      app: {
        cwd: 'src/',
        src: ['app/**/*.js', '!app/**/*.spec.js']
      },
      prod: {}
    },

    less: {
      dev: {
        files: {
          'build/css/style.css': 'src/less/style.less'
        }
      },
      prod: {
        files: {
          'build/css/style.css': 'src/less/style.less'
        },
        options :{
          cleancss: true
        }
      }
    },

    notify: {
      watch: {
        options: {
          message: ''
        }
      },
      start: {
        options: {
          duration: 2,
          message: 'Waiting for changes...'
        }
      }
    },

    html2js: {
      options: {
        module: 'myApp.templates'
      },
      main: {
        src: 'src/**/*.html',
        dest: 'src/app/template.js'
      }
    },

    concat: {
      // options: {
      //   banner: "(function(){\n",
      //   footer: "\n})();"
      // },
      js: {
        src: ['src/app/**/*.js', '!src/app/**/*.spec.js'],
        dest: 'tmp/app.js'
      }
    },

    ngmin: {
      js: {
        src: 'tmp/app.js',
        dest: 'tmp/app.min.js'
      }
    },

    uglify: {
      withVendor: {
        files: {
          'build/app/app.min.js': ['<%= vendorFiles %>', 'tmp/app.min.js']
        }
      },
      noVendor: {
        files: {
          'build/app/app.min.js': ['tmp/app.min.js']
        }
      }
    },

    karma: {
      options: {
        configFile: 'build/karma.conf.js'
      },
      unit: {
        background: true
      },
      once: {
        singleRun: true
      }
    }

  };

  grunt.initConfig(require('lodash').extend(gruntConfig, userConfig));

  grunt.event.on('watch', function(action, filepath, target) {
    action = action.charAt(0).toUpperCase() + action.slice(1);

    grunt.config(['notify', 'watch'], {
      options: {
        duration: 1.5,
        message: action + ': ' + filepath
      }
    });
  });

  grunt.task.registerMultiTask('index', 'Copy files', function() {
    var scripts = ['app/app.min.js'];

    if (this.target !== 'prod' ) {
      scripts = userConfig.vendorFiles.concat(this.filesSrc);
    }

    if (this.target !== 'spec') {
      return grunt.file.copy('src/index.html', 'build/index.html', {
        process: function(content, path) {
          return grunt.template.process(content, {
            data: {
              scripts: scripts
            }
          });
        }
      });
    }

    scripts = userConfig.vendorFiles.concat(userConfig.testFiles, this.filesSrc);

    grunt.file.copy('src/karma.conf.js', 'build/karma.conf.js', {
      process: function(content, path) {
        return grunt.template.process(content, {
          data: {
            scripts: scripts
          }
        });
      }
    });
  });

  grunt.registerTask('default', ['clean:build', 'html2js', 'copy', 'index:app', 'index:spec', 'less:dev', 'karma:unit', 'notify:start', 'watch']);
  grunt.registerTask('compile', ['clean:build', 'html2js', 'copy:assets', 'concat', 'ngmin', 'uglify:withVendor', 'index:prod', 'less:prod', 'clean:tmp']);
  grunt.registerTask('compile:novendor', ['clean:build', 'html2js', 'copy:assets', 'concat', 'ngmin', 'uglify:noVendor', 'index:prod', 'less:prod', 'clean:tmp']);
};
