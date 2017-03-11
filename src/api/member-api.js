import { HttpClient } from 'aurelia-fetch-client';
import 'fetch';

export class MemberApi {
  static inject() { return [ HttpClient ]; }

  constructor(http) {
    this._http = http;
  }

  /**
   * @desc A call to get the current member
   * @return {Member} the member object
   *
   */
  async getCurrent() {
    return await this._http.fetch('member')
      .then(response => response.json());
  }
}
