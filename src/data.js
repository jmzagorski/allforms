import { Router } from 'aurelia-router';
import { FormDataApi } from './api/index';

/**
 * @summary Displays the list of data forms associated with a form template
 */
export class Data {
  static inject() { return [ Router, FormDataApi ]; }

  constructor(router, api) {
    this.dataList = [];

    this.gridOptions = {
      autoEdit: true,
      editable: true,
      forceFitColumns: true
    };

    this._api = api;
    this._router = router;
    this._selectedRecords = [];
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

  capture(record) {
    const index = this._selectedRecords.indexOf(record) ;
    if (index === -1) {
      this._selectedRecords.push(record);
    } else {
      this._selectedRecords.splice(index, 1);
    }
  }

  snapshotSelected() {
    for (let record of this._selectedRecords) {
      this._api.snapshot(record.id);
    }
  }

  copySelected() {
    for (let record of this._selectedRecords) {
      this._api.copy(record.id);
    }
  }
}
