import { Router } from 'aurelia-router';
import { FormApi } from './api/form-api';

export class Forms {

  static inject = [ Router, FormApi ];

  constructor(router, api) {
    this.forms = [];
    this._router = router;
    this._api = api;
  }

  /**
   * @summary activates the forms view model through aurelia lifecycle
   * @desc activates the view model and creates urls for every form
   */
  async activate() {
    this.forms = await this._api.get();
    this.routeToNew = this._router.generate('new-form');

    this.forms.forEach(f => {
      f.url = this._router.generate('dir', { form: f.id });
    });
  }
}
