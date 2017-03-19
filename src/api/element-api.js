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

  get(id) {
    return this._http.fetch(`elements/${id}`)
      .then(response => response.json());
  }

  save(element) {
    const url = element.id ? `elements/${element.id}` : 'elements';
    const method = element.id ? 'PUT' : 'POST';

    return this._http.fetch(url, {
      method: method,
      body: json(element)
    }).then(response => response.json());
  }
}
