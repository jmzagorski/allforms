import * as schemas from './schemas/index';
import getDefaults from './renderers/defaults';

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
    const elemDefaults = getDefaults(model.formStyle, model.elementType);

    for (let prop in elemDefaults) {
      if (!model[prop]) model[prop] = elemDefaults[prop];
    }

    this.schema = schemas[model.formStyle][model.elementType];
    this.model = model;
  }
}
