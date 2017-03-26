import { Store } from 'aurelia-redux-plugin';
import { getActiveForm, requestForm } from './domain/index';

export class DataEdit {
  static inject() { return [ Store ]; }

  constructor(store) {
    this.html = '';

    this._store = store;
    this._unsubscribe = () => {};
  }

  activate(params) {
    this._unsubscribe = this._store.subscribe(() => this._update());

    this._store.dispatch(requestForm(params.form));
  }

  _update() {
    const form = getActiveForm(this._store.getState());

    if (form) {
      this.html = form.template;
    }
  }

  deactivate() {
    this._unsubscribe();
  }
}
