import * as schemas from './schemas/index';

export class Metadata {

  constructor() {
    this.schema = null;
    this.data = null;
    this._options = {};
  }

  activate(model) {
    this.schema = schemas[model.style][model.type];

    const defaults = this._setupDefaultsFor(model.type);
    this.data = Object.assign(model, defaults, model);
  }

  _setupDefaultsFor(type) {
    if (!this._options[type]) {
      this._options[type] = {};

      for (let option of this.schema) {
        this._options[type][option.key] = option.default;
      }
    }

    return this._options[type];
  }
}
