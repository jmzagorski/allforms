import { Store } from 'aurelia-redux-plugin';
import {
  getActiveForm,
  requestForm,
  requestFormData,
  getFormData
} from './domain';

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
    this._formDataId = params.formDataId;
    this._unsubscribe = this._store.subscribe(() => this._update());
    this._store.dispatch(requestForm(params.form));
    this._store.dispatch(requestFormData(params.formDataId));
  }

  _update() {
    const state = this._store.getState();
    const form = getActiveForm(state);
    const formData = getFormData(state);

    if (form && formData) {
      this.html = form.template;
      this.autoSaveOpts = {
        action: 'PATCH',
        api: form.api + '/' + this._formDataId,
        data: formData.data
      };
    }
  }

  deactivate() {
    this._unsubscribe();
  }
}
