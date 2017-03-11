import { createStore } from 'redux';
import rootReducer from './root-reducer';
import 'bootstrap'; // aurelia
import 'babel-polyfill'; // await /async
import * as Interact from 'interact.js';
import * as macros from './functions/excel/macros';

export async function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-value-converters')
    .plugin('aurelia-dialog')
    .plugin('aurelia-view-manager')
    .plugin('aurelia-validatejs')
    .plugin('aurelia-form')
    .plugin('aurelia-redux-plugin', {
      store: createStore(rootReducer)
    });

  aurelia.container.registerInstance(Interact, Interact);

  for (let macro in macros) {
    const type = Object.prototype.toString.call(macros[macro]);
    // only register classes
    if (type === '[object Function]') {
      aurelia.container.registerSingleton('ExcelMacros', macros[macro]);
    }
  }

  await aurelia.start();
  aurelia.setRoot('app');
}
