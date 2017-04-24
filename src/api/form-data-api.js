import { HttpClient, json } from 'aurelia-fetch-client';
import { importFetch } from '../utils';

const fetch = importFetch(); // eslint-disable-line no-unused-vars

export const baseUrl = 'forms/data';
/**
 * @summary RESTFUL api for interact with the form data backend
 * @implements {IFormDataApi}
 */
export class FormDataApi {

  static inject = [ HttpClient ];

  /**
   * @summary instantiates the FormDataApi with a fetch client
   * @param {Object} http the http fetch object
   * @param {Object} http.fetch the method to call a RESTFUL api
   */
  constructor(http) {
    this._http = http;
  }

  /**
   * @summary Gets an array of the master form's IFormDataSummary objects
   * @param {string} formId the id of the master form
   * @return {Promise<IFormDataSummary[]>} a promise to return IFormDataSummary
   * array
   */
  getAll(formId) {
    return this._http.fetch(`forms/${formId}/data`)
      .then(response => response.json());
  }

  /**
   * @summary Gets a single IFormData object
   * @param {string} name the unique name of the IFormData object
   * @return {Promise<IFormData>} a promise to return the IFormData object
   */
  getByName(name) {
    // TODO name should not have any spaces
    return this._http.fetch(`${baseUrl}?name=${name}`)
      .then(response => response.json())
      .then(data => (data || [])[0]);
  }

  /**
   * @summary Saves a single IFormDataObject
   * @param {IFormData} formData the id of the IFormData object
   * @return {Promise<IFormData>} a promise to return the IFormData object
   */
  save(formData) {
    const url = formData.id ? `${baseUrl}/${formData.id}` : baseUrl;
    const method = formData.id ? 'PUT' : 'POST';

    return this._http.fetch(url, {
      method: method,
      body: json(formData)
    }).then(response => response.json());
  }

  snapshot(id) {
    return this._http.fetch(`${baseUrl}/snapshots`, {
      method: 'POST',
      body: json({ originalId: id })
    }).then(response => response.json());
  }

  // TODO - need memebe name
  copy(id) {
    return this._http.fetch(`${baseUrl}/copy`, {
      method: 'POST',
      body: json({ originalId: id })
    }).then(response => response.json());
  }

}
