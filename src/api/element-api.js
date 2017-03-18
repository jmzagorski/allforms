import { HttpClient, json } from 'aurelia-fetch-client';
import { importFetch } from '../utils';

const fetch = importFetch(); // eslint-disable-line no-unused-vars

/**
 * @implements {IElementApi}
 */
export class ElementApi {
  static inject() { return [ HttpClient ]; }

  constructor(http) {
    this._http = http;
  }

  async get(id) {
    return await this._http.fetch(`elements/${id}`)
      .then(response => response.json());
  }

  async save(element) {
    const url = element.id ? `elements/${element.id}` : 'elements';
    const method = element.id ? 'PUT' : 'POST';

    return await this._http.fetch(url, {
      method: method,
      body: json(element)
    }).then(response => response.json());
  }
}
