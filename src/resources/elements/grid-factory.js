import { Grid, Data } from 'slickgrid-es6';

export class GridFactory {

  constructor() {
    this.defaults = {};
  }

  /**
   * @summary creates a new slick grid
   * @param {string} options.gridId the html id of the grid
   * @param {string} [options.pk=id] unique field of the data set. does not need
   * @param {Object[]} [options.data] the data for the grid, which would not
   * create a dataview
   * @param {Object[]} [options.columnOptions] the grid column options
   * @param {Object} [options.gridOptions] the grid options 
   */
  create(options) {
    this.defaults = {
      metadata: [],
      gridOptions: {},
      columnOptions: [],
      pk: 'id'
    };

    Object.assign(this.defaults, options);

    if (!this.defaults.gridId) throw new Error('No grid id was found');

    return new Grid(
      this.defaults.gridId,
      this.defaults.data || new Data.DataView(),
      this.defaults.columnOptions,
      this.defaults.gridOptions
    );
  }
}
