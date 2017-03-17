import { HttpClient, json } from 'aurelia-fetch-client';
import { importFetch } from '../utils';

const fetch = importFetch(); // eslint-disable-line no-unused-vars

export class TemplateApi {
  static inject() { return [ HttpClient ]; }

  constructor(http) {
    this._http = http;
  }

  /**
   * @summary find a local version of the template
   * @param {String} formId the id of the form
   * @return {Element} the template DOM Element
   */
  find(formId) {
    return DOM.querySelectorAll(`form#${formId}`)[0];
  }

  /**
   * @summary A call to get the template for a particular form
   * @param {String} formId the id of the form
   * @return {Promise<Object>} a promise for the template object from the server
   */
  async get(formId) {
    return await this._http.fetch(`templates/${formId}`)
      .then(response => response.json());
  }

  /**
   * @summary edits an existing template
   * @param {Object} template the template object
   * @return {Promise<Object>} a promise for the template object from the server
   *
   */
  async edit(template) {
    return await this._http.fetch(`templates/${template.id}`, {
      method: 'PUT',
      body: json(template)
    }).then(response => response.json());
  }

  /**
   * @summary adds a new template
   * @param {Object} template the template object
   * @return {Promise<Object>} a promise for the template object from the server
   *
   */
  async add(template) {
    return await this._http.fetch('templates', {
      method: 'POST',
      body: json(template)
    }).then(response => response.json());
  }
}
