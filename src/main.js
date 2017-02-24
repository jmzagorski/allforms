// we want font-awesome to load as soon as possible to show the fa-spinner
import { createStore } from 'redux';
import rootReducer from './root-reducer';
import '../styles/styles.css';
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import * as Interact from 'interact.js';
import * as macros from './functions/excel/macros';

// comment out if you don't want a Promise polyfill (remove also from webpack.common.js)
import * as Bluebird from 'bluebird';
Bluebird.config({ warnings: false });

export async function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-value-converters')
    .plugin('aurelia-dialog')
    .plugin('aurelia-view-manager')
    .plugin('aurelia-validatejs')
    .plugin('aurelia-form')
    //.plugin('aurelia-animator-css')
    .plugin('aurelia-redux-plugin', {
      store: createStore(rootReducer)
    });
  // Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
  // aurelia.use.plugin('aurelia-html-import-template-loader')
  aurelia.container.registerInstance(Interact, Interact);

  for (let macro in macros) {
    const type = Object.prototype.toString.call(macros[macro]);
    // only register classes
    if (type === '[object Function]') {
      aurelia.container.registerSingleton('ExcelMacros', macros[macro])
    }
  }

  await aurelia.start();
  aurelia.setRoot('app');

  // if you would like your website to work offline (Service Worker),
  // install and enable the @easy-webpack/config-offline package in webpack.config.js and uncomment the following code:
  /*
  const offline = await System.import('offline-plugin/runtime');
  offline.install();
  */
}
