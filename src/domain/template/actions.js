import { TemplateApi } from '../../api/template-api';
import { Store } from 'aurelia-redux-plugin';
import { getTemplate } from './selectors';

export const REQUEST_TEMPLATE = 'REQUEST_TEMPLATE';
export const RECEIVED_TEMPLATE = 'RECEIVED_TEMPLATE';
export const CREATE_TEMPLATE = 'CREATE_TEMPLATE';
export const EDIT_TEMPLATE = 'EDIT_TEMPLATE';
export const TEMPLATE_CREATED = 'TEMPLATE_CREATED';
export const TEMPLATE_EDITED = 'TEMPLATE_EDITED';

export function requestTemplate(id) {
  return {
    type: REQUEST_TEMPLATE,
    payload: { id }
  }
}

export function receivedTemplate(data, hasError) {
  return {
    type: RECEIVED_TEMPLATE,
    payload: data,
    error: hasError
  }
}

export function templateCreated(data, hasError) {
  return {
    type: TEMPLATE_CREATED,
    payload: data,
    error: hasError
  }
}

export function templateEdited(data, hasError) {
  return {
    type: TEMPLATE_EDITED,
    payload: data,
    error: hasError
  }
}

export const LOAD_TEMPLATE_SUCCESS = 'LOAD_TEMPLATE_SUCCESS';
export const ADD_TEMPLATE_SUCCESS = 'ADD_TEMPLATE_SUCCESS';
export const EDIT_TEMPLATE_SUCCESS = 'EDIT_TEMPLATE_SUCCESS';

function loadTemplateSuccess(template) {
  return { type: LOAD_TEMPLATE_SUCCESS, template };
}

function addTemplateSuccess(template) {
  return { type: ADD_TEMPLATE_SUCCESS, template };
}

function editTemplateSuccess(template) {
  return { type: EDIT_TEMPLATE_SUCCESS, template };
}

export class TemplateActions {
  static inject() { return [ TemplateApi, Store ]; }

  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  /**
   * @desc Gets the template and dispatches that object in a success event
   * @param {String} formId the id of the form
   */
  async loadTemplateFor(formId) {
    const template = await this._api.get(formId);

    this._store.dispatch(loadTemplateSuccess(template));
  }

  async save(template) {
    const localVersion = getTemplate(this._store.getState());

    if (localVersion.id) {
      const serverVersion = await this._api.edit(template);
      this._store.dispatch(editTemplateSuccess(serverVersion));
    } else {
      const serverVersion = await this._api.add(template);
      this._store.dispatch(addTemplateSuccess(serverVersion));
    }
  }
}
