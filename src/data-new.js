import { Router } from 'aurelia-router';
import { Store } from 'aurelia-redux-plugin';
import { createFormData, getActiveMember, getActiveForm } from './domain';

export class DataNew {

  static inject = [ Store, Router ];

  constructor(store, router) {
    this.model = {};
    this.formName = null;
    this.memberId = null;
    this.hasAutoName = false;

    this._store = store;
    this._router = router;
    this._unsubscribe = this._store.subscribe(this._update.bind(this));
  }

  activate(params) {
    this.formName = params.formName;
    this.memberId = params.memberId;
    this._update();
  }

  create() {
    this._store.dispatch(createFormData(this.model));

    this._router.navigateToRoute('data', {
      memberId: this.memberId, formName: this.formName
    });
  }

  _update() {
    const state = this._store.getState();
    const form = getActiveForm(state);
    const currentMember = getActiveMember(state);

    if (form) {
      this.model.formId = form.id;
      this.hasAutoName = !!form.autoname;
    }

    if (currentMember) {
      this.model.memberId = currentMember.id;
    }
  }

  deactivate() {
    this._unsubscribe();
  }
}
