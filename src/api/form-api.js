import { HttpClient, json } from 'aurelia-fetch-client';
import { importFetch } from '../utils';

const fetch = importFetch(); // eslint-disable-line no-unused-vars

/**
 * @implements {IFormApi}
 */
export class FormApi {
  static inject() { return [ HttpClient ]; }

  constructor(http) {
    this._http = http;
  }

  async getAll() {
    return await this._http.fetch('forms')
      .then(response => response.json());
  }

  async save(form) {
    const url = 'forms';
    const method = form.id ? 'PUT' : 'POST';

    return await this._http.fetch(url, {
      method: method,
      body: json(form)
    }).then(response => response.json());
  }
}
