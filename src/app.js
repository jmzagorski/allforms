import RouterConfig from './config/router';
import InitialState from './config/initial-state';
import { Store } from 'aurelia-redux-plugin';
import { getLoginId } from './domain';

export class App {
  static inject = [ RouterConfig, InitialState, Store ];

  constructor(routerConf, initialState, store) {
    this.login = null;
    this.profileUrl = null;
    this.router = routerConf.router;
    this._routerConf = routerConf;
    this._initialState = initialState;
    this._store = store;
    this._unsubscribe = () => {};

    // call this now. if you do in activate the profile route will not be recognized
    // not sure why
    this._routerConf.configure();
  }

  async activate() {
    this._unsubscribe = this._store.subscribe(this._getMember.bind(this))
    await this._initialState.configure();
  }

  _getMember() {
    this.login = getLoginId(this._store.getState());
    this.profileUrl = this.router.generate('member', { memberId: this.login });
  }

  deactivate() {
    this._unsubscribe();
  }
}
