import { getActiveForm } from './domain/index';
import { Store } from 'aurelia-redux-plugin';
import { Router } from 'aurelia-router';

export class Directory {

  static inject() { return [ Router, Store ]; }

  constructor(router, store) {
    this._router = router;
    this._store = store;
  }

  // TODO move to property or use decorator
  get form() {
    return getActiveForm(this._store.getState());
  };

  activate(params) {
    this._createRoutes();
  }

  _createRoutes() {
    this.form.files.forEach(f => {
      const route = this._router.routes.find(r => f.name === r.name);

      if (!route) throw Error(`No route found for ${f.name}`);

      f.url = this._router.generate(route.name, { form: this.form.name });
    });
  }
}
