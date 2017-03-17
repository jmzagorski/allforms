import RouterConfig from './config/router';
import HttpConfig from './config/http-client';
import InitialState from './config/initial-state';
import { Store } from 'aurelia-redux-plugin';
import { getActiveMember } from './domain/index';

export class App {
  static inject() { return [ RouterConfig, HttpConfig, InitialState, Store ]; }

  constructor(routerConf, httpConf, initialState, store) {
    this.router = routerConf.router;
    this._routerConf = routerConf;
    this._httpConf = httpConf;
    this._initialState = initialState;
    this._store = store;
  }

  get member() {
    return getActiveMember(this._store.getState());
  }

  async activate() {
    this._routerConf.configure();
    this._httpConf.configure();
    await this._initialState.configure();
  }
}
