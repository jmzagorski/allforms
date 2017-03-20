import { Store } from 'aurelia-redux-plugin';
import {
  TemplateActions,
  getTemplate
} from './domain/index';

export class DataEdit {
  static inject() { return [ Store, TemplateActions ]; }

  constructor(store, templateActions) {
    this.html = '';

    this._store = store;
    this._templateActions = templateActions;
  }

  async activate(params) {
    await this._templateActions.loadTemplateFor(params.form);

    const template = getTemplate(this._store.getState());

    this.html = template.html || this.html;
  }
}
