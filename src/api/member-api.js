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

  async getCurrent() {
    return await this._http.fetch('member')
      .then(response => response.json());
  }
}
