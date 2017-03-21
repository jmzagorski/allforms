import { Store } from 'aurelia-redux-plugin';
import { getTemplate, requestTemplate } from './domain/index';

export class DataEdit {
  static inject() { return [ Store ]; }

  constructor(store) {
    this.html = '';

    this._store = store;
    this._unsubscribe = () => {};
  }

  activate(params) {
    this._unsubscribe = this._store.subscribe(() => this._update());

    this._store.dispatch(requestTemplate(params.form));
  }

  _update() {
    const template = getTemplate(this._store.getState());

    debugger;
    if (template) {
      this.html = template.html;
    }
  }

  deactivate() {
    this._unsubscribe();
  }
}
