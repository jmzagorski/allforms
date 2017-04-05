import { getActiveForm, requestForm } from './domain/index';
import { Store } from 'aurelia-redux-plugin';
import { Router } from 'aurelia-router';

export class Directory {
  static inject() { return [ Router, Store ]; }

  constructor(router, store) {
    this.routes = [];
    this._router = router;
    this._store = store;
    this._unsubscribe = () => {};
  }

  activate(params) {
    this._unsubscribe = this._store.subscribe(this._update.bind(this));
    this._store.dispatch(requestForm(params.form));
  }

  _update() {
    const form =  getActiveForm(this._store.getState());

    if (!form) return;

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

  deactivate() {
    this._unsubscribe();
  }
}
