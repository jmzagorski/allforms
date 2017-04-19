import { NewInstance } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { importFetch } from '../utils';

const fetch = importFetch(); // eslint-disable-line no-unused-vars

/**
 * @implements {IMetadataApi}
 */
export class MetadataApi {

  static inject = [ NewInstance.of(HttpClient) ];

  constructor(http) {
    this._http = http;
  }

  get(api, formId) {
    return this._http.fetch(api + '/' + formId + '/metadata')
      .then(response => response.json());
  }
}
