import { TemplateApi } from '../../api/template-api';
import { Store } from 'aurelia-redux-plugin';

export const LOAD_TEMPLATE_SUCCESS = 'LOAD_TEMPLATE_SUCCESS';

function loadTemplateSuccess(template) {
  return { type: LOAD_TEMPLATE_SUCCESS, template };
}

export class TemplateActions {
  static inject() { return [ TemplateApi, Store ]; }

  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  /**
   * @desc Gets the template and dispatches that object in a success event
   * @param {String} formName the name of the form
   */
  async loadTemplateFor(formName) {
    const template = await this._api.get(formName);

    this._store.dispatch(loadTemplateSuccess(template));
  }
}
