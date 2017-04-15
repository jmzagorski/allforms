import { bindable } from 'aurelia-framework';
import { GridFactory } from './grid-factory';

export class GridCustomElement {
  @bindable id;
  @bindable data;
  @bindable options;
  @bindable pk;

  static inject = [ Element, GridFactory ];

  constructor(element, gridFactory) {
    this.element = element;
    this.gridId = 'data-grid'
    this.grid = null;
    this._columns = [];
    this._gridFactory = gridFactory;
  }

  attached() {
    this.grid = this._gridFactory.create({
      gridId: '#' + this.gridId,
      pk: this.pk,
      data: this.data,
      columnOptions: this._columns,
      gridOptions: this.options
    });

    const $container = this.grid.getContainerNode();
    const parentWidth = this.element.parentNode.offsetWidth;
    $container.style.width = parentWidth - 1 + 'px';
    this.grid.resizeCanvas();

    // make sure canvas fits within div so horizontal scrollbar is gone
    const $canvas = this.grid.getCanvasNode();
    $canvas.style.width = parentWidth - 3 + 'px';
  }

  addColumn(column) {
    if (column.field == this.pk) column.pk = true;

    this._columns.push(column);
  }

  detached() {
    if (this.grid) this.grid.destroy();
  }
}
