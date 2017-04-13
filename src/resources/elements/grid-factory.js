import { Grid, Data } from 'slickgrid-es6';

export class GridFactory {

  constructor() {
    this.defaults = [];
  }

  /**
   * @summary creates a new slick grid
   * @param {string} options.gridId the html id of the grid
   * @param {Object[]} options.data the data to be used with the grid
   * @param {Object[]} [options.columnOptions] the slick grid column options
   * @param {Object[]} [options.columnOptions.pk] the primary key field
   * @param {Object} [options.gridOptions] SlickGrid options 
   *
   */
  create(options) {
    this.defaults = {
      data: [],
      metadata: [],
      gridOptions: {},
      columnOptions: []
    };

    Object.assign(this.defaults, options);

    if (!this.defaults.gridId) throw new Error('No grid id was found');

    for(let prop in this.defaults.data[0]) {
      const column = {
        id: prop,
        name: prop.charAt(0).toUpperCase() + prop.slice(1), // TODO put in utils
        field: prop
      };

      const columnOpts = this.defaults.columnOptions.find(m => m.id === prop);

      if (columnOpts) Object.assign(column, columnOpts);

      this.defaults.metadata.push(column);
    }

    const dataView =  new Data.DataView()
    const pk = this.defaults.columnOptions.find(m => m.pk) || {};
    dataView.setItems(this.defaults.data, pk.id);

    return new Grid(
      this.defaults.gridId,
      dataView,
      this.defaults.metadata,
      this.defaults.gridOptions
    );
  }
}
