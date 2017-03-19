import RouterConfig from './config/router';
import InitialState from './config/initial-state';
import { Store } from 'aurelia-redux-plugin';
import { getActiveMember } from './domain/index';

export class App {
  static inject = [ RouterConfig, InitialState, Store ];

  constructor(routerConf, initialState, store) {
    this.router = routerConf.router;
    this._routerConf = routerConf;
    this._initialState = initialState;
    this._store = store;
  }

  get member() {
    return getActiveMember(this._store.getState());
  }

  async activate() {
    this._routerConf.configure();
    await this._initialState.configure();
  }
}
