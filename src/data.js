import { Router } from 'aurelia-router';
import { FormDataApi } from './api/index';
import { getFormData } from './domain/index';

/**
 * @summary Displays the list of data forms associated with a form template
 */
export class Data {
  static inject() { return [ Router, FormDataApi ]; }

  constructor(router, api) {
    this.dataList = [];

    this._api = api;
    this._router = router;
  }

  async activate(params) {
    this.dataList = await this._api.getAll(params.form);
    this.routeToNew = this._router.generate('newData', { form: params.form });

    if (this.dataList) {
      this.dataList.forEach(d => {
        d.url = this._router.generate('formData', { form: params.form, formDataId: d.id });
      });
    }
  }

  async capture(dataId) {
    // TODO: take a snapshot of the data, save as pdf, keep form data intact
  }
}
