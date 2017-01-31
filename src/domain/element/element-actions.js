import { ElementApi } from '../../api/element-api';
import { Store } from 'aurelia-redux-plugin';

export const LOAD_ELEMENTS_SUCCESS = 'LOAD_ELEMENTS_SUCCESS';
export const ADD_ELEMENT_SUCCESS = 'ADD_ELEMENT_SUCCESS';
export const EDIT_ELEMENT_SUCCESS = 'EDIT_ELEMENT_SUCCESS';

function loadElementsSuccess(elements) {
  return { type: LOAD_ELEMENTS_SUCCESS, elements };
}

function addElementSuccess(element) {
  return { type: ADD_ELEMENT_SUCCESS, element };
}

function editElementSuccess(element) {
  return { type: EDIT_ELEMENT_SUCCESS, element };
}

export class ElementActions {
  static inject() { return [ ElementApi, Store ]; }

  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  /**
   * @desc Gets all the form elements and dispatches to all listening actions
   * @param {String} formName the name of the form
   */
  async loadElements(formName) {
    const elements = await this._api.getAllFor(formName);

    this._store.dispatch(loadElementsSuccess(elements));
  }

  /**
   * @desc Saves the element and dispatches the success to all listening events
   * @param {Element} element the element object
   */
  async saveElement(element) {
    const serverVersion = await this._api.save(element);

    element.id ? this._store.dispatch(editElementSuccess(serverVersion)) :
      this._store.dispatch(addElementSuccess(serverVersion));
  }
}
