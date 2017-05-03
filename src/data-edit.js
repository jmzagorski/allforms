import { Store } from 'aurelia-redux-plugin';
import {
  getActiveForm,
  requestFormData,
  getFormData,
  editDataOnForm
} from './domain';

export class DataEdit {
  static inject() { return [ Store ]; }

  constructor(store) {
    this.html = '';
    this.autoSaveOpts = {};

    this._formDataId = null;
    this._store = store;
    this._unsubscribe = this._store.subscribe(() => this._update());
  }

  activate(params) {
    this._store.dispatch(requestFormData(params.formDataName));
    this._update();
  }

  save(e) {
    this._store.dispatch(editDataOnForm(e.detail.api, this._formDataId, e.detail.data));
  }

  _update() {
    const state = this._store.getState();
    const form = getActiveForm(state);
    const formData = getFormData(state);

    if (form && formData) {
      this._formDataId = formData.id;
      this.html = form.template;
      this.autoSaveOpts = {
        data: formData.data
      };
    }
  }

  deactivate() {
    this._unsubscribe();
  }
}
