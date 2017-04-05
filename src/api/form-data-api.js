import { HttpClient, json } from 'aurelia-fetch-client';
import { importFetch } from '../utils';


const fetch = importFetch(); // eslint-disable-line no-unused-vars

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
    return this._http.fetch(`forms/${formId}/form-data`)
      .then(response => response.json());
  }

  /**
   * @summary Gets an single IFormData object
   * @param {number} formDataId the id of the IFormData object
   * @return {Promise<IFormData>} a promise to return the IFormData object
   */
  get(formDataId) {
    return this._http.fetch(`form-data/${formDataId}`)
      .then(response => response.json());
  }

  /**
   * @summary Saves a single IFormDataObject
   * @param {IFormData} formData the id of the IFormData object
   * @return {Promise<IFormData>} a promise to return the IFormData object
   */
  save(formData) {
    const url = formData.id ? `form-data/${formData.id}` : 'form-data';
    const method = formData.id ? 'PUT' : 'POST';

    return this._http.fetch(url, {
      method: method,
      body: json(formData)
    }).then(response => response.json());
  }

  snapshot(id) {
    return this._http.fetch(`form-data/${id}/snapshots`, {
      method: 'POST',
      body: json({ formDataId: id })
    }).then(response => response.json());
  }
}
