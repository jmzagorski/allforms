import { ElementApi } from '../../api/element-api';
import { Store } from 'aurelia-redux-plugin';
import { getElements } from './element-selectors';

export const LOAD_ELEMENT_SUCCESS = 'LOAD_ELEMENT_SUCCESS';
export const ADD_ELEMENT_SUCCESS = 'ADD_ELEMENT_SUCCESS';
export const EDIT_ELEMENT_SUCCESS = 'EDIT_ELEMENT_SUCCESS';
export const ELEMENT_NOT_FOUND = 'ELEMENT_NOT_FOUND';

function loadElementSuccess(element) {
  return { type: LOAD_ELEMENT_SUCCESS, element };
}

function addElementSuccess(element) {
  return { type: ADD_ELEMENT_SUCCESS, element };
}

function editElementSuccess(element) {
  return { type: EDIT_ELEMENT_SUCCESS, element };
}

function elementNotFound() {
  return { type: ELEMENT_NOT_FOUND, payload: {} };
}

export class ElementActions {
  static inject() { return [ ElementApi, Store ]; }

  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  /**
   * @desc Gets the element by id and dispatches to all listening actions
   * @param {Number} id the id of the element
   */
  async loadElement(id) {
    // this is to prevent pointless api calls, but allow a zero which will pass
    // the first test
    if (!id && id !== 0 ) {
      this._store.dispatch(elementNotFound());
    } else {
      let element = getElements(this._store.getState()).find(e => e.id === id);

      if (!element) element = await this._api.get(id);

      this._store.dispatch(loadElementSuccess(element));
    }

    return Promise.resolve();
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
