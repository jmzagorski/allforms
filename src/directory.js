import {
  requestMetadata,
  getOverallMetadataStatus,
  getActiveForm,
  getActiveMember
} from './domain/index';
import { FormApi } from './api';
import { Store } from 'aurelia-redux-plugin';
import { Router } from 'aurelia-router';

export class Directory {
  static inject() { return [ Router, Store, FormApi ]; }

  constructor(router, store, formApi) {
    this.routes = [];
    this.status = 'muted';
    this._router = router;
    this._store = store;
    this._formApi = formApi;
    this._unsubscribes = [];
  }

  get form() {
    return getActiveForm(this._store.getState());
  }

  activate(params) {
    this.memberId = params.memberId;
    this.formName = params.formName;
    this._unsubscribes.push(this._store.subscribe(this._updateForm.bind(this)));
    this._unsubscribes.push(this._store.subscribe(this._getStatus.bind(this)));
    this._store.dispatch(requestMetadata(params.memberId, params.formName));
  }

  async copy() {
    const member = getActiveMember(this._store.getState());
    await this._formApi.copy(this.form.id, member.id);
  }

  _updateForm() {
    this.routes = [];

    if (!this.form) return;

    this.interfaceRoute = this._router.generate('interface', {
      memberId: this.memberId, formName: this.formName
    });

    this._router.routes
      .filter(r => r.settings.dirListing)
      .forEach(route => {
        const url = this._router.generate(route.name, {
          memberId: this.memberId, formName: this.form.name
        });
        this.routes.push({
          url,
          description: route.settings.description,
          icon: route.settings.icon,
          name: route.name
        });
      });
  }

  _getStatus() {
    this.status = getOverallMetadataStatus(this._store.getState()) || this.status;
  }

  deactivate() {
    for (let s of this._unsubscribes) s();
  }
}
