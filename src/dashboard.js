import { FormDataApi } from './api';
import { isArray } from './utils';

export class Dashboard {

  static inject = [ FormDataApi ];

  constructor(api) {
    this.dataList = [];
    this.dataFormProps = [];
    this.gridOptions = {
      forceFitColumns: true
    };

    this._api = api;
  }

  async activate(form) {
    const dataForms = await this._api.getAll(form.id);
    this.dataFormProps = [];
    // TODO generate URL
    this.dataFormProps.push('form');

    if (dataForms.length) {
      for (let d of dataForms) {
        this.dataList.push(this._getFields(d));
      }
    }
  }

  _getFields(formData) {
    const gridData = {};

    for (let prop in formData.data) {
      const data = formData.data;

      this.dataFormProps.push(prop);

      if (isArray(data[prop])) {
        gridData[prop] = data[prop].join(' & ');
      } else {
        gridData[prop] = data[prop];
      }
    }

    gridData.form = formData.name;

    return gridData;
  }
}
