import { Router } from 'aurelia-router';
import { Store } from './config/store';
import { getFormList } from './domain/index';

export class Forms {
  static inject() { return [ Router, Store ]; }

  constructor(router, store) {
    this._router = router;
    this._store = store;
  }

  get forms() {
    return getFormList(this._store.getState());
  }

  /**
   * @summary activates the forms view model through aurelia lifecycle
   * @desc activates the view model and creates urls for every form
   *
   */
  activate() {
    this.forms.forEach(f => {
      f.url = this._router.generate('dir', { form: f.id });
    });
  }
}
