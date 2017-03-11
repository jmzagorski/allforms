import 'bootstrap'; // aurelia
import 'babel-polyfill'; // await /async
import { Store } from './config/store';
import rootReducer from './root-reducer';
import * as Interact from 'interact.js';
import * as macros from './functions/excel/macros';

export async function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-value-converters')
    .plugin('aurelia-dialog')
    .plugin('aurelia-view-manager')
    .plugin('aurelia-form');

  aurelia.container.registerInstance(Interact, Interact);

  for (let macro in macros) {
    const type = Object.prototype.toString.call(macros[macro]);
    // only register classes
    if (type === '[object Function]') {
      aurelia.container.registerSingleton('ExcelMacros', macros[macro]);
    }
  }

  Store.init(aurelia.container, rootReducer);

  await aurelia.start();
  aurelia.setRoot('app');
}
