import { bindable, children, inlineView, TaskQueue } from 'aurelia-framework';
import { GridFactory } from './grid-factory';

@inlineView(`<template>
  <div class="slickgrid-container" id="\${id}">
  <slot></slot>
  </div>
</template>
`)
export class GridCustomElement {
  @bindable id = 'data-grid';
  @bindable data;
  @bindable height = 500;
  @bindable options;
  @bindable pk;
  @bindable filters;
  @children('grid-column') columns = [];

  static inject = [ Element, GridFactory, TaskQueue ];

  constructor(element, gridFactory, taskQueue) {
    this.element = element;
    this.grid = null;

    this._gridId = '';
    this._dataView = null
    this._gridFactory = gridFactory;
    this._taskQueue = taskQueue;
    this._subscriptions = [];
    this._itemChangedListener;
  }

  bind(bindingContext) {
    this._bindingContext = bindingContext;
    this._gridId = '#' + this.id
  }

  attached() {
    // FIXME use taskqueu because bug in Aurelia
    // https://github.com/aurelia/templating/issues/403
    this._taskQueue.queueTask(this._initGrid.bind(this))
  }

  detached() {
    if (this.grid) this.grid.destroy();

    for(let sub of this._subscriptions) sub[0](sub[1]);;

    for (let c of this.columns) {
      c.element.removeEventListener('itemchanged', this._itemChangedListener);
    }
  }

  _initGrid() {
    this.grid = this._gridFactory.create({
      gridId: this._gridId,
      pk: this.pk,
      columnOptions: this.columns.map(c => c.options),
      gridOptions: this.options
    });

    this._dataView = this.grid.getData();
    this._dataView.beginUpdate();
    this._dataView.setItems(this.data);
    this._dataView.setFilter(this._compositeFilter.bind(this));
    this._dataView.endUpdate();

    this._resize();
    this._subscribeEvents();
  }

  _resize() {
    const $container = this.grid.getContainerNode();
    const parentWidth = this.element.parentNode.offsetWidth;
    $container.style.width = parentWidth - 1 + 'px';
    $container.style.height = this.height + 'px';
    this.grid.resizeCanvas();
  }

  _subscribeEvents() {
    const updateRowCount = ((e, args) => {
      this.grid.updateRowCount();
      this.grid.render();
    }).bind(this)

    const invalidateRows = ((e, args) => {
      this.grid.invalidateRows(args.rows);
      this.grid.render();
    }).bind(this);

    this._registerEvent(this._dataView.onRowCountChanged, updateRowCount);
    this._registerEvent(this._dataView.onRowsChanged, invalidateRows);

    // column specific events
    this._itemChangedListener = this._updateView.bind(this);
    for (let c of this.columns) {
      c.element.addEventListener('itemchanged', this._itemChangedListener);
      if (c.subscriptions) {
        for (let sub in c.subscriptions) {
          this._registerEvent(this.grid[sub], c.subscriptions[sub]);
        }
      }
    }
  }

  _registerEvent(event, fn) {
    event.subscribe(fn);
    this._subscriptions.push([ event.unsubscribe, fn ]);
  }

  _compositeFilter(item) {
    let show = true;
    for (let f of this.filters) {
      show =  f.call(this._bindingContext, item) && show;
    }

    return show;
  }

  _updateView(event) {
    this._dataView.updateItem(event.detail[this.pk], event.detail);
  }
}
