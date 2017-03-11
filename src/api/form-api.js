import { HttpClient, json } from 'aurelia-fetch-client';
import 'fetch';


export class FormApi {
  static inject() { return [ HttpClient ]; }

  constructor(http) {
    this._http = http;
  }

  /**
   * @desc A call to get all the forms for the member
   * @return {Array<Form>} the form object array
   *
   */
  async getAll() {
    return await this._http.fetch('forms')
      .then(response => response.json());
  }

  /**
   * @desc A call to save a form
   * @param {Form} form the form object to save
   * @return {Form} the form from the api, not the original parameter
   *
   */
  async save(form) {
    const url = 'forms';
    const method = form.id ? 'PUT' : 'POST';

    return await this._http.fetch(url, {
      method: method,
      body: json(form)
    }).then(response => response.json());
  }
}
