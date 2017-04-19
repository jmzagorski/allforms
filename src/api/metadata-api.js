import { NewInstance } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { importFetch } from '../utils';

const fetch = importFetch(); // eslint-disable-line no-unused-vars

/**
 * @implements {IMetadataApi}
 */
export class MetadataApi {
  static inject() { return [ NewInstance.of(HttpClient) ]; }

  constructor(http) {
    this._http = http;
  }

  get(form) {
    return this._http.fetch(form.api + '/' + form.id + '/metadata')
      .then(response => response.json());
  }
}
