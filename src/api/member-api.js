import { HttpClient } from 'aurelia-fetch-client';
import { importFetch } from '../utils';

const fetch = importFetch(); // eslint-disable-line no-unused-vars

/**
 * @implements {IMemberApi}
 */
export class MemberApi {
  static inject() { return [ HttpClient ]; }

  constructor(http) {
    this._http = http;
  }

  get(memberId) {
    return this._http.fetch('members/' + memberId)
      .then(response => response.json());
  }

  getCurrent() {
    return this._http.fetch('members/current')
      .then(response => response.json());
  }

  getForms(memberId) {
    return this._http.fetch('members/' + memberId + '/forms')
      .then(response => response.json());
  }
}
