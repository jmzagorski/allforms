import { requestForm, getActiveForm, editForm } from './domain/index';
import { Store } from 'aurelia-redux-plugin';
import { Router } from 'aurelia-router';

export class Settings  {

  static inject = [ Store, Router ];

  constructor(store, router) {
    this.model = {};
    this._store = store;
    this._router = router;
    this._unsubscribe = () => {};
  }

  activate(params) {
    this._unsubscribe = this._store.subscribe(this._update.bind(this));
    this._store.dispatch(requestForm(params.form));
  }

  configure() {
    this._store.dispatch(editForm(this.model));
    this._router.navigateToRoute('dir', { form: this.model.id });
  }

  deactivate = () => this._unsubscribe();

  _update() {
    const form = getActiveForm(this._store.getState()); 
    // copy state to keep it immutable
    Object.assign(this.model, form);
  }
}
