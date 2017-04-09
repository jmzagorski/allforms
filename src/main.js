// we want font-awesome to load as soon as possible to show the fa-spinner
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';
import '../styles/styles.css';
import '../styles/bootstrap-overrides.css';
import 'bootstrap';
import { createStore, applyMiddleware } from 'redux';
import { HttpClient } from 'aurelia-fetch-client';
import { getBaseUrl } from './env';
import { PLATFORM } from 'aurelia-pal';
import { BindingMiddleware } from './binding-middleware';
import { BindingSignaler } from 'aurelia-templating-resources';
import { FormulaService } from './elements/services/formula-service';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './root-reducer';
import setupSaga from './root-saga';
import configureHttp from './config/http-client';
import * as Interact from 'interact.js';
import * as macros from './functions/excel/macros';
import * as Bluebird from 'bluebird';

Bluebird.config({ warnings: false });

export async function configure(aurelia) {
  const sagaMiddleware = createSagaMiddleware();
  const http = new HttpClient();
  const signaler = new BindingSignaler();
  const signalerMiddleware = new BindingMiddleware(signaler);

  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-dialog')
    .plugin('aurelia-value-converters')
    .plugin('aurelia-redux-plugin', {
      store: createStore(rootReducer, applyMiddleware(sagaMiddleware, signalerMiddleware.listen))
    });

  configureHttp(http, getBaseUrl(PLATFORM.location));

  sagaMiddleware.run(setupSaga(http));

  aurelia.container.registerInstance(Interact, Interact);
  aurelia.container.registerInstance(HttpClient, http);
  aurelia.container.registerInstance(BindingSignaler, signaler);
  aurelia.container.registerSingleton('FormServices', FormulaService);

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
