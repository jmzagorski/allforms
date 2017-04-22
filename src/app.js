import RouterConfig from './config/router';
import InitialState from './config/initial-state';
import { Store } from 'aurelia-redux-plugin';
import { getLoginId } from './domain';

export class App {
  static inject = [ RouterConfig, InitialState, Store ];

  constructor(routerConf, initialState, store) {
    this.login = null;
    this.router = routerConf.router;
    this._routerConf = routerConf;
    this._initialState = initialState;
    this._store = store;
    this._unsubscribe = () => {};
  }

  activate() {
    this._store.subscribe(this._getMember.bind(this))
    this._routerConf.configure();
    this._initialState.configure();
  }

  _getMember() {
    this.login = getLoginId(this._store.getState());
  }

  detached() {
    this._unsubscribe();
  }
}
