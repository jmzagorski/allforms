'use strict'
const path = require('path')

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns
    basePath: __dirname,

    // frameworks to use
    frameworks: ['jspm', 'jasmine'],

    // list of files / patterns to load in the browser
    files: [],

    // list of files to exclude
    exclude: [],

    jspm: {
      // Edit this to your needs
      loadFiles: [
        'test/unit/setup.js',
        'test/unit/**/*.js'
      ],
      serveFiles: [
        'src/**/*.*',
        'jspm_packages/system-polyfills.js'
      ],
      paths: {
        '*': 'src/*',
        'test/*': 'test/*',
        'github:*': 'jspm_packages/github/*',
        'npm:*': 'jspm_packages/npm/*'
      }
    },

    // preprocess matching files before serving them to the browser
    preprocessors: {
      'test/**/*.js': ['babel'],
      'src/**/*.js': ['babel']
    },
    'babelPreprocessor': {
      options: {
        sourceMap: 'inline',
        presets: [ ['es2015', { loose: true }], 'stage-1'],
        plugins: [
          'syntax-flow',
          'transform-decorators-legacy',
          'transform-flow-strip-types',
          [ 'istanbul', { 'ignore': 'test/' } ]
        ]
      }
    },

    // test results reporter to use
    reporters: ['mocha'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
