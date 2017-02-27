import { getRecentFormHistory } from './domain/index';
import { Store } from 'aurelia-redux-plugin';
import { Router } from 'aurelia-router';

export class Directory {
  static inject() { return [ Router, Store ]; }

  constructor(router, store) {
    this.historyRoutes = [];
    this._router = router;
    this._store = store;
  }

  get history() {
    return getRecentFormHistory(this._store.getState()); 
  }

  activate(params) {
    this.history.forEach(h => {
      const route = this._router.routes.find(r => h.name === r.name);

      // TODO log warning
      if (route) {
        const url = this._router.generate(route.name, { form: h.formId });
        this.historyRoutes.push(Object.assign({}, h, { url }));
      }
    });
  }
}
