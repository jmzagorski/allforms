import { HttpClient } from 'aurelia-fetch-client';
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
    // TODO api should be templates/${formname} but json server is not
    // coorporating
    return await this._http.fetch(`forms/${formName}/templates`)
      .then(response => response.json());
  }
}
