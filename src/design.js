import { Store } from 'aurelia-redux-plugin';
import {
  ElementActions,
  getElements
} from './domain/index';

export class Design {
  static inject() { return [ Store, ElementActions ]; }

  constructor(store, elementActions) {
    this._store = store;
    this._elementActions = elementActions;
  }

  get elements() {
    return getElements(this._store.getState());
  }

  async activate(params) {
    await this._elementActions.loadElements(params.form);
  }
}
