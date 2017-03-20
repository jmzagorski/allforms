import { Router } from 'aurelia-router';
import { Store } from 'aurelia-redux-plugin';
import { createFormData } from './domain/index';

export class DataNew {

  static inject = [ Store, Router ];

  constructor(store, router) {
    this.model = {};
    this._store = store;
    this._router = router;
  }

  activate(params) {
    this.model.formId = params.form;
  }

  create() {
    this._store.dispatch(createFormData(this.model));

    this._router.navigateToRoute('data', { form: this.model.formId });
  }
}
