import { Store } from 'aurelia-redux-plugin';
import { getActiveForm, requestForm } from './domain/index';

export class DataEdit {
  static inject() { return [ Store ]; }

  constructor(store) {
    this.html = '';
    this.autoSaveOpts = {};

    this._formDataId = null;
    this._store = store;
    this._unsubscribe = () => {};
  }

  activate(params) {
    this.formDataId = params.formDataId;
    this._unsubscribe = this._store.subscribe(() => this._update());
    this._store.dispatch(requestForm(params.form));
  }

  _update() {
    const form = getActiveForm(this._store.getState());

    if (form) {
      this.html = form.template;
      this.autoSaveOpts = {
        action: 'PATCH',
        api: form.api + '/' + this.formDataId
      };
    }
  }

  deactivate() {
    this._unsubscribe();
  }
}
