import { Router } from 'aurelia-router';
import { MemberApi } from './api/member-api';

export class Forms {

  static inject = [ Router, MemberApi ];

  constructor(router, api) {
    this.forms = [];
    this._router = router;
    this._api = api;
  }

  /**
   * @summary activates the forms view model through aurelia lifecycle
   * @desc activates the view model and creates urls for every form
   */
  async activate(params) {
    this.forms = await this._api.getForms(params.memberId);
    this.routeToNew = this._router.generate('new-form');

    this.forms.forEach(f => {
      f.url = this._router.generate('dir', {
        memberId: params.memberId, formName: f.name
      });
    });
  }
}
