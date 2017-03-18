import { HttpClient } from 'aurelia-fetch-client';
import { importFetch } from '../utils';

const fetch = importFetch(); // eslint-disable-line no-unused-vars

/**
 * @implements {IElementTypeApi}
 */
export class ElementTypeApi {
  static inject() { return [ HttpClient ]; }

  constructor(http) {
    this._http = http;
  }

  async getAll() {
    return await this._http.fetch('element-types')
      .then(response => response.json());
  }
}
