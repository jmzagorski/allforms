import { requestMetadata, getStatus, getActiveForm, requestForm } from './domain/index';
import { Store } from 'aurelia-redux-plugin';
import { Router } from 'aurelia-router';

export class Directory {
  static inject() { return [ Router, Store ]; }

  constructor(router, store) {
    this.routes = [];
    this.status = 'muted';
    this._router = router;
    this._store = store;
    this._unsubscribes = [];
  }

  activate(params) {
    this._unsubscribes.push(this._store.subscribe(this._updateForm.bind(this)));
    this._unsubscribes.push(this._store.subscribe(this._getStatus.bind(this)));
    this._store.dispatch(requestForm(params.form));
    this._store.dispatch(requestMetadata(params.form));
  }

  copy() {
    // TODO
  }

  _updateForm() {
    this.routes = [];
    const form =  getActiveForm(this._store.getState());

    if (!form) return;

    this.interfaceRoute = this._router.generate('interface', { form: form.id });

    this._router.routes
      .filter(r => r.settings.dirListing)
      .forEach(route => {
        const url = this._router.generate(route.name, { form: form.id });
        this.routes.push({
          url,
          description: route.settings.description,
          icon: route.settings.icon,
          name: route.name
        });
      });
  }

  _getStatus() {
    this.status = getStatus(this._store.getState()) || this.status;
  }

  deactivate() {
    for (let s of this._unsubscribes) s();
  }
}
