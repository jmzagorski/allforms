import { HttpClient, json } from 'aurelia-fetch-client';
import { importFetch } from '../utils';

const fetch = importFetch(); // eslint-disable-line no-unused-vars

export class ElementApi {
  static inject() { return [ HttpClient ]; }

  constructor(http) {
    this._http = http;
  }

  /**
   * @desc A call to get one element by id
   * @param {Number} id the id of the element
   * @return {Element} the element
   */
  async get(id) {
    return await this._http.fetch(`elements/${id}`)
      .then(response => response.json());
  }

  /**
   * @desc A call to save the element
   * @param {Element} element the element object
   * @return {Element} the new element returned from the api cal, not the
   * original passed in
   */
  async save(element) {
    const url = 'elements';
    const method = element.id ? 'PUT' : 'POST';

    return await this._http.fetch(url, {
      method: method,
      body: json(element)
    }).then(response => response.json());
  }
}
