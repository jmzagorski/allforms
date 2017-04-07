import { baseUrl } from './api/form-data-api';
import { getBaseUrl } from './env';
import { requestForm, getActiveForm, editForm, createForm } from './domain/index';
import { Store } from 'aurelia-redux-plugin';
import { Router } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';

export class Settings  {

  static inject = [ Store, Router ];

  constructor(store, router) {
    // TODO: currently there is no configuration for style, everything is based on the
    // bootstrap style so there is no point in keeping values in the database
    const defaultApi = getBaseUrl(PLATFORM.location);
    this.model = { style: 'bootstrap', api: defaultApi + baseUrl };
    this._store = store;
    this._router = router;
    this._unsubscribe = () => {};
    this._action = null;
  }

  activate(params) {
    this._action = createForm;
    if (params.form) {
      this._unsubscribe = this._store.subscribe(this._update.bind(this));
      this._store.dispatch(requestForm(params.form));
      this._action = editForm;
    }
  }

  configure() {
    this._store.dispatch(this._action(this.model));

    if (this.model.id) {
      this._router.navigateToRoute('dir', { form: this.model.id });
    } else {
      this._router.navigateToRoute('allforms');
    }
  }

  deactivate() {
    this._unsubscribe();
  }

  _update() {
    const form = getActiveForm(this._store.getState());
    // copy state to keep it immutable
    Object.assign(this.model, form);
  }
}
