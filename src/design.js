import { Store } from 'aurelia-redux-plugin';
import { ElementActions } from './domain/index';

export class Design {
  static inject() { return [ Store, ElementActions ]; }

  constructor(store, elementActions) {
    this._store = store;
    this._elementActions = elementActions;
  }

  async activate(params) {
    await this._elementActions.loadElements(params.form);

    this.elements = this._store.getState().elements;
  }
}
