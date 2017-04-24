import { HttpClient, json } from 'aurelia-fetch-client';
import { importFetch } from '../utils';

const fetch = importFetch(); // eslint-disable-line no-unused-vars

/**
 * @implements {IFormApi}
 */
export class FormApi {
  static inject() { return [ HttpClient ]; }

  constructor(http) {
    this._http = http;
  }

  get(formId) {
    const url = formId ? `forms/${formId}` : 'forms';

    return this._http.fetch(url)
      .then(response => response.json());
  }

  getMemberForm(memberId, formName) {
    return this._http.fetch(`forms?name=${formName}&memberId=${memberId}`)
      .then(response => response.json())
      .then(data => (data || [])[0]);
  }

  getProfile(memberId, formName) {
    return this._http.fetch(`forms/profile/${memberId}/${formName}`)
      .then(response => response.json());
  }

  save(form) {
    const url = form.id ? `forms/${form.id}` : 'forms';
    const method = form.id ? 'PUT' : 'POST';

    return this._http.fetch(url, {
      method: method,
      body: json(form)
    }).then(response => response.json());
  }

  saveTemplate({id, template}) {
    return this._http.fetch(`forms/${id}`, {
      method: 'PATCH',
      body: json({ id, template })
    }).then(response => response.json());
  }
}
