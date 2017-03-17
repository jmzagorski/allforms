import { HttpClient } from 'aurelia-fetch-client';
import { importFetch } from '../utils';

const fetch = importFetch(); // eslint-disable-line no-unused-vars

export class ElementTypeApi {
  static inject() { return [ HttpClient ]; }

  constructor(http) {
    this._http = http;
  }

  /**
   * @desc A call to get all the element types
   * @return {Array<ElementType>} the array of element types
   */
  async getAll() {
    return await this._http.fetch('element-types')
      .then(response => response.json());
  }
}
