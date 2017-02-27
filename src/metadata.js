import * as schemas from './schemas/index';

export class Metadata {

  constructor() {
    this.schema = null;
    this.model = null;
  }

  /**
   * @summary activates the view model by setting up the form schema from the
   * passed in model
   * @param {Object} model an object that has the element metadata
   *
   */
  activate(model) {
    this.model = model;
    this.schema = schemas[model.formStyle][model.elementType];
    const elemDefaults = this._setupDefaultsFor(model.elementType);
    Object.assign(model, elemDefaults, model);
  }

  _setupDefaultsFor() {
    const options = {};

    for (let opt of this.schema) {
      options[opt.key] = opt.default;
    }

    return options;
  }
}
