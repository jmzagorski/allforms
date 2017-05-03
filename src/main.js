// we want font-awesome to load as soon as possible to show the fa-spinner
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';
import '../styles/grid.less';
import '../styles/styles.css';
import '../styles/bootstrap-overrides.css';
import 'bootstrap';
import { createStore, applyMiddleware } from 'redux';
import { HttpClient } from 'aurelia-fetch-client';
import { EnvironmentService } from './env';
import { PLATFORM } from 'aurelia-pal';
import { BindingMiddleware } from './binding-middleware';
import { BindingSignaler } from 'aurelia-templating-resources';
import { FormulaService } from './elements/services/formula-service';
import { InputListService } from './elements/services/input-list-service';
import { AureliaFormService } from './elements/services/aurelia-form-service';
import { LookupProvider } from './functions/excel/macros/lookup-provider';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './root-reducer';
import setupSaga from './root-saga';
import configureHttp from './config/http-client';
import * as Interact from 'interact.js';
import * as Bluebird from 'bluebird';
import { Formatters } from 'slickgrid-es6';
import {
  HtmlFormatter,
  LinkFormatter,
  ToggleFormatter,
  SnapshotFormatter,
  BsIconContextFormatter
} from './resources/elements/grid/index'

Bluebird.config({ warnings: false });

export async function configure(aurelia) {
  const sagaMiddleware = createSagaMiddleware();
  const http = new HttpClient();
  const signaler = new BindingSignaler();
  const signalerMiddleware = new BindingMiddleware(signaler);
  const env = new EnvironmentService(PLATFORM);

  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-dialog')
    .plugin('aurelia-value-converters')
    .plugin('aurelia-redux-plugin', {
      store: createStore(rootReducer, applyMiddleware(sagaMiddleware, signalerMiddleware.listen))
    })
  .feature('resources');

  configureHttp(http, env.generateBaseApi());

  sagaMiddleware.run(setupSaga(http, env));

  aurelia.container.registerInstance(Interact, Interact);
  aurelia.container.registerInstance(HttpClient, http);
  aurelia.container.registerInstance(BindingSignaler, signaler);
  aurelia.container.registerInstance(EnvironmentService, env);
  aurelia.container.registerSingleton('FormServices', FormulaService);
  aurelia.container.registerSingleton('FormServices', InputListService);
  aurelia.container.registerSingleton('FormServices', AureliaFormService);
  aurelia.container.registerSingleton('MacroProviders', LookupProvider);
  aurelia.container.registerSingleton('GridFormatters', HtmlFormatter);
  aurelia.container.registerSingleton('GridFormatters', LinkFormatter);
  aurelia.container.registerSingleton('GridFormatters', ToggleFormatter);
  aurelia.container.registerSingleton('GridFormatters', SnapshotFormatter);
  aurelia.container.registerSingleton('GridFormatters', BsIconContextFormatter);

  
  // register slick grid's and obey interface
  for (let prop in Formatters) {
    aurelia.container.registerHandler('GridFormatters', () => {
      return {
        format: Formatters[prop],
        constructor: { name: prop + 'Formatter' }
    }});
  }

  await aurelia.start();
  aurelia.setRoot('app');
}
