import { HttpClient, json } from 'aurelia-fetch-client';
import { importFetch } from '../utils';

const fetch = importFetch(); // eslint-disable-line no-unused-vars

export class ElementApi {
  static inject() { return [ HttpClient ]; }

  constructor(http) {
    this._http = http;
  }

  /**
   * @desc A call to get all the elements for a particular form, searching by
   * form name
   * @param {String} formName the name of the form
   * @return {Array<Element>} the array of elements
   */
  async getAllFor(formName) {
    return await this._http.fetch(`forms/${formName}/elements`)
      .then(response => response.json());
  }

  /**
   * @desc A call to save the element
   * @param {Element} element the element object
   * @return {Element} the new element returned from the api cal, not the
   * original passed in
   */
  async save(element) {
    // can't figure out how json server can override normal routes
    const url = 'elements';
    const method = element.id ? 'PUT' : 'POST';

    return await this._http.fetch(url, {
      method: method,
      body: json(element)
    }).then(response => response.json());
  }
}
