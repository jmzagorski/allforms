import { HttpClient, json } from 'aurelia-fetch-client';
import { importFetch } from '../utils';

const fetch = importFetch(); // eslint-disable-line no-unused-vars

export class TemplateApi {
  static inject() { return [ HttpClient ]; }

  constructor(http) {
    this._http = http;
  }

  /**
   * @desc A call to get the template for a particular form
   * @param {String} formName the name of the form
   * @return {Template} the template object
   */
  async get(formName) {
    return await this._http.fetch(`templates/${formName}`)
      .then(response => response.json());
  }

  async save(template) {
    const url = 'templates';
    const method = template.id ? 'PUT' : 'POST';

    return await this._http.fetch(url, {
      method: method,
      body: json(template)
    }).then(response => response.json());
  }
}
