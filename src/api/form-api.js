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

  get(formId) {
    const url = formId ? `forms/${formId}` : 'forms';

    return this._http.fetch(url)
      .then(response => response.json());
  }

  save(form) {
    const url = 'forms';
    const method = form.id ? 'PUT' : 'POST';

    return this._http.fetch(url, {
      method: method,
      body: json(form)
    }).then(response => response.json());
  }
}
