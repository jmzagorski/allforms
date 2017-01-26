import {HttpClient} from 'aurelia-fetch-client';
import {inject} from 'aurelia-framework';
import {importFetch} from './utils';
const fetch = importFetch();

@inject(HttpClient)
export class Design {

  constructor(http) {
    this.form = null;
    this._http = http;
  }

  async activate(params) {
    this.form = await this._http.fetch(`forms/${params.form}/elements`)
			.then(response => response.json());
  }
}
