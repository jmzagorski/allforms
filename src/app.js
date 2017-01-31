import RouterConfig from './config/router';
import HttpConfig from './config/http-client';
import InitialState from './config/initial-state';
import { Store } from 'aurelia-redux-plugin';

export class App {
  static inject() { return [ RouterConfig, HttpConfig, InitialState, Store ]; }

  constructor(routerConf, httpConf, initialState, store) {
    this.router = routerConf.router;
    this.username = null;

    this._routerConf = routerConf;
    this._httpConf = httpConf;
    this._initialState = initialState;
    this._store = store;
  }

  async activate() {
    this._routerConf.configure();
    this._httpConf.configure();

    await this._initialState.configure();
    this.username = this._store.getState().member.loginName;
  }
}
