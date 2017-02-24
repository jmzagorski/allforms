import { Router } from 'aurelia-router';
import { Store } from 'aurelia-redux-plugin';
import { getFormList } from './domain/index';

export class Forms {
  static inject() { return [ Router, Store ]; }

  constructor(router, store) {
    this._router = router;
    this._store = store;
  }

  get forms() {
    return getFormList(this._store.getState());
  };

  activate() {
    this.forms.forEach(f => {
      f.url = this._router.generate('dir', { form: f.id });
    });
  }
}
