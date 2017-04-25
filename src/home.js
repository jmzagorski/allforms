import { Store } from 'aurelia-redux-plugin';
import { Router } from 'aurelia-router';
import {
  getActiveMember,
  getFormList,
  getDataFormList,
  requestMemberActivity,
} from './domain';

export class Home {

  static inject = [ Store, Router ];

  constructor(store, router) {
    this.activity = [];
    this.forms = [];
    this.contributions = [];
    this.datum = [];
    this.memberId = null;

    this._store = store;
    this._router = router;
    this._unsubscribe = store.subscribe(this._update.bind(this));
  }

  activate() {
    this.memberId = getActiveMember(this._store.getState()).id;
    this._store.dispatch(requestMemberActivity(this.memberId));
    this._update();
  }

  _update() {
    this.forms = [];
    this.datum = [];
    const state = this._store.getState();
    const forms = getFormList(state);
    const dataForms = getDataFormList(state);

    if (forms && dataForms) {
      forms.forEach(f => {
        this.forms.push({
          name: f.name,
          url: this._router.generate('dir', { memberId: f.memberId, formName: f.name})
        })
      });

      dataForms.forEach(d => {
        this.datum.push({
          display: `${d.form.name}/${d.name}`,
          url: this._router.generate('formData', {
            // TODO need form object on IFormData
            memberId: d.form.memberId, formName: d.form.name, formDataName: d.name
          })
        })
      });

    }
  }

  deactivate() {
    this._unsubscribe();
  }
}
