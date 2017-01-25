import {HttpClient} from 'aurelia-fetch-client';
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {importFetch} from './utils';

const fetch = importFetch();

@inject(HttpClient, Router)
export class Forms {

  constructor(http, router) {
    this.forms = [];
    this._http = http;
    this._router = router;
  }

  async activate() {
    this.forms = await this._http.fetch('forms')
      .then(response => response.json());

    this.forms.forEach(f => {
      f.url = this._router.generate('dir', { form: f.id });
    });
  }
}
