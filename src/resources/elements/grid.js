import { bindable } from 'aurelia-framework';
import { GridFactory } from './grid-factory';

export class GridCustomElement {
  @bindable id;
  @bindable data;

  static inject = [ Element, GridFactory ];

  constructor(element, gridFactory) {
    this.element = element;
    this.gridId = 'data-grid'
    this.grid = null;
    this._gridFactory = gridFactory;
  }

  attached() {
    this.grid = this._gridFactory.create({
      gridId: '#' + this.gridId,
      data: this.data,
      columnOptions: [{ id: this.id, pk: true }],
      gridOptions: { forceFitColumns: true }
    });


    const $container = this.grid.getContainerNode();
    $container.style.width = this.element.parentNode.offsetWidth - 2 + 'px';
    this.grid.resizeCanvas();
  }

  detached() {
    if (this.grid) this.grid.destroy();
  }
}
