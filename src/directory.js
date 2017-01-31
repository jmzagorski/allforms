import { Store } from 'aurelia-redux-plugin';
import { Router } from 'aurelia-router';
import { getForm} from './utils';

export class Directory {

  static inject() { return [ Router, Store ]; }

  constructor(router, store) {
    this._router = router;
    this._store = store;
  }

  activate(params) {
    const state = this._store.getState();
    this.form = getForm(state.forms, params.form);

    this.form.files.sort((a, b) => a.priority - b.priority);
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
