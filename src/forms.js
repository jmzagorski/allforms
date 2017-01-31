import { Router } from 'aurelia-router';
import { Store } from 'aurelia-redux-plugin';

export class Forms {
  static inject() { return [ Router, Store ]; }

  constructor(router, store) {
    this.forms = [];
    this._router = router;
    this._store = store;
  }

  activate() {
    this.forms = this._store.getState().forms;

    this.forms.forEach(f => {
      f.url = this._router.generate('dir', { form: f.name });
    });
  }
}
