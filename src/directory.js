import {HttpClient} from 'aurelia-fetch-client';
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {importFetch} from './utils';

const fetch = importFetch();

@inject(HttpClient, Router)
export class Directory {

  constructor(http, router) {
    this.files = [];
    this.form = null;
    this._router = router;
    this._http = http;
  }

  async activate(params) {
    this.form = await this._http.fetch(`forms/${params.form}`)
      .then(response => response.json());
    this.form.files.sort((a, b) => a.priority - b.priority);
    this._createRoutes();
  }

  _createRoutes() {
    this.form.files.forEach(f => {
      const route = this._router.routes.find(r => f.name === r.name);

      if (!route) throw Error(`No route found for ${f.name}`);

      f.url = this._router.generate(route.name, { form: this.form.id });
    });
  }
}
