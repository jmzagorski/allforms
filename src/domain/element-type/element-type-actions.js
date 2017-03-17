import { ElementTypeApi } from '../../api/element-type-api';
import { Store } from 'aurelia-redux-plugin';

export const LOAD_ELEMENT_TYPES_SUCCESS = 'LOAD_ELEMENT_TYPES_SUCCESS';

function loadElementTypesSuccess(elementTypes) {
  return { type: LOAD_ELEMENT_TYPES_SUCCESS, elementTypes };
}

export class ElementTypeActions {
  static inject() { return [ ElementTypeApi, Store ]; }

  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  /**
   * @desc Gets all the element types and dispatches to all listening actions
   */
  async loadAll() {
    const elementTypes = await this._api.getAll();

    this._store.dispatch(loadElementTypesSuccess(elementTypes));
  }
}
