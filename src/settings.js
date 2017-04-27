import { getActiveForm, editForm, createForm } from './domain/index';
import { Store } from 'aurelia-redux-plugin';
import { Router } from 'aurelia-router';

export class Settings  {

  static inject = [ Store, Router ];

  constructor(store, router) {
    // TODO: currently there is no configuration for style, everything is based on the
    // bootstrap style so there is no point in keeping values in the database
    this.model = { style: 'bootstrap' };
    this._store = store;
    this._router = router;
    this._action = null;

    this._unsubscribe = this._store.subscribe(this._update.bind(this));
  }

  activate(params) {
    this.model.memberId = params.memberId;
    this.model.name = params.formName;
    this._action = createForm;

    if (params.formName) {
      this._update();
      this._action = editForm;
    }
  }

  configure() {
    this._store.dispatch(this._action(this.model));

    if (this.model.id) {
      this._router.navigateToRoute('dir', {
        memberId: this.model.memberId, formName: this.model.name
      });
    } else {
      this._router.navigateToRoute('member', {
        memberId: this.model.memberId
      });
    }
  }

  deactivate() {
    this._unsubscribe();
  }

  _update() {
    const form = getActiveForm(this._store.getState());
    // copy state to keep it immutable
    if (form) Object.assign(this.model, form);
  }
}
