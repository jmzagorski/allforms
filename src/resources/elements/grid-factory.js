import { Grid, Data } from 'slickgrid-es6';

export class GridFactory {

  constructor() {
    this.defaults = [];
  }

  /**
   * @summary creates a new slick grid
   * @param {string} options.gridId the html id of the grid
   * @param {Object[]} options.data the data to be used with the grid
   * @param {string} [options.pk=id] unique field of the data set. does not need
   * @param {Object[]} [options.columnOptions] the grid column options
   * @param {Object} [options.gridOptions] the grid options 
   */
  create(options) {
    this.defaults = {
      data: [],
      metadata: [],
      gridOptions: {},
      columnOptions: [],
      pk: 'id'
    };

    Object.assign(this.defaults, options);

    if (!this.defaults.gridId) throw new Error('No grid id was found');

    // if no columns are given see if we can create it for them
    // or just make sure the column has a last an id, name and field
    for(let prop in this.defaults.data[0]) {
      const column = {
        id: prop,
        name: prop.charAt(0).toUpperCase() + prop.slice(1), // TODO put in utils
        field: prop
      };

      let columnOpts = this.defaults.columnOptions.find(m => m.field === prop);

      if (columnOpts) columnOpts = Object.assign({}, column, columnOpts);
      
      // if no column options are present create a basic column
      if (!this.defaults.columnOptions.length) {
        this.defaults.columnOptions.push(column);
      }
    }

    const dataView =  new Data.DataView()
    dataView.setItems(this.defaults.data, this.defaults.pk);

    return new Grid(
      this.defaults.gridId,
      dataView,
      this.defaults.columnOptions,
      this.defaults.gridOptions
    );
  }
}
