import { Store } from 'aurelia-redux-plugin';
import {
  getActiveForm,
  requestFormData,
  getFormData
} from './domain';

export class DataEdit {
  static inject() { return [ Store ]; }

  constructor(store) {
    this.html = '';
    this.autoSaveOpts = {};

    this._store = store;
    this._unsubscribe = this._store.subscribe(() => this._update());
  }

  activate(params) {
    this._store.dispatch(requestFormData(params.formDataName));
    this._update();
  }

  _update() {
    const state = this._store.getState();
    const form = getActiveForm(state);
    const formData = getFormData(state);

    if (form && formData) {
      this.html = form.template;
      this.autoSaveOpts = {
        method: 'PATCH',
        dataId: formData.id,
        data: formData.data
      };
    }
  }

  deactivate() {
    this._unsubscribe();
  }
}
