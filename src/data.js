import { Store } from 'aurelia-redux-plugin';
import { Router } from 'aurelia-router';
import { FormDataApi } from './api/index';
import { getActiveForm } from './domain';

/**
 * @summary Displays the list of data forms associated with a form template
 */
export class Data {
  static inject() { return [ Router, FormDataApi, Store ]; }

  constructor(router, api, store) {
    this.dataList = [];
    this.memberId = null;
    this.gridOptions = {
      autoEdit: true,
      editable: true,
      forceFitColumns: true
    };

    this._api = api;
    this._router = router;
    this._selectedRecords = [];
    this._store = store;

    this._unsubscribe = this._store.subscribe(this._updateList.bind(this));
  }

  async activate(params) {
    this.memberId = params.memberId;
    await this._updateList();

    this.routeToNew = this._router.generate('newData', {
      memberId: params.memberId, formName: params.formName
    });
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
      // cant snapshot a snapshot
      if (!record.originalId) {
        this._api.snapshot(record.id);
      }
    }
  }

  copySelected() {
    for (let record of this._selectedRecords) {
      this._api.copy(record.id);
    }
  }

  showSnapshot(item) {
    if (item.originalId) {
      const parent = this.dataList.find(d => d.id === item.originalId);
      while (parent) {
        if (!parent._expanded) return false;

        parent = this.dataList.find(d => d.id === parent.originalId);
      }
    }
    return true;
  }

  setExpanded(item) {
    item._expanded = !item._expanded;
  }

  deactivate() {
    this._unsubscribe();
  }

  async _updateList() {
    const form = getActiveForm(this._store.getState());

    if (form) {
      this.dataList = await this._api.getAll(form.id);

      // make sure like records stay together
      // TODO add grouping then sort so don't have to deal with this logic
      this.dataList.sort((a,b) => {
        if (a.id !== b.originalId) {
          return 1;
        }

        if ((a.originalId === b.originalId) || !a.originalId && !b.originalId) {
          if (a.saved > b.saved) {
            return 1
          } else {
            return -1;
          }
        }

        return 0;
      });

      this.dataList.forEach(d => {
        const routeName = d.originalId ? 'snapshot' : 'formData';

        d.url = this._router.generate(routeName, {
          formName: form.name, formDataName: d.name, memberId: this.memberId
        });

        if (d.originalId) d._indent = 1;
      });
    }
  }
}
