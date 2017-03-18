import { HttpClient, json } from 'aurelia-fetch-client';
import { importFetch } from '../utils';

const fetch = importFetch(); // eslint-disable-line no-unused-vars

/**
 * @implements {ITemplateApi}
 */
export class TemplateApi {
  static inject() { return [ HttpClient ]; }

  constructor(http) {
    this._http = http;
  }

  async get(formId) {
    return await this._http.fetch(`templates/${formId}`)
      .then(response => response.json());
  }

  async edit(template) {
    return await this._http.fetch(`templates/${template.id}`, {
      method: 'PUT',
      body: json(template)
    }).then(response => response.json());
  }

  async add(template) {
    return await this._http.fetch('templates', {
      method: 'POST',
      body: json(template)
    }).then(response => response.json());
  }
}
