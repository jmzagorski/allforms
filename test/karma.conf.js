/**
 * Inspired by @AngularClass
 * https://github.com/AngularClass/angular2-webpack-starter
 */
'use strict'
const path = require('path')
const webpackConfig = require('../webpack.config.karma');
require('babel-register')({ only: "*.babel.js" });

webpackConfig.entry = {};

module.exports = function (config) {
  config.set({

    basePath: __dirname,
    frameworks: ['jasmine'],
    exclude: [],

    // we are building the test environment in ./spec-bundle.js
    files: [
      './unit/jasmine-extensions.js',
      '../node_modules/jasmine-data-provider/src/index.js',
      // polyfill for Promise
      '../node_modules/babel-polyfill/dist/polyfill.js',

      { pattern: 'spec-bundle.js', watched: false }
    ],

    preprocessors: {
      'spec-bundle.js': ['coverage', 'webpack', 'sourcemap']
    },

    webpack: webpackConfig,

    coverageReporter: {
      reporters: [{
        type: 'json',
        subdir: '.',
        file: 'coverage-final.json'
      }]
    },

    remapIstanbulReporter: {
      src: path.join(__dirname, 'coverage/coverage-final.json'),
      reports: {
        html: path.join(__dirname, 'coverage/')
      },
      timeoutNotCreated: 1000,
      timeoutNoMoreFiles: 1000
    },

    webpackMiddleware: {
      noInfo: true
    },

    reporters: [ 'mocha', 'coverage', 'karma-remap-istanbul' ],

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [ 'Chromium' ],
    singleRun: false
  })
}
