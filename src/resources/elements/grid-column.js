import Formatters from './grid-formatters';
import Editors from './grid-editors';
import { GridCustomElement } from './grid';
import { BindingEngine, bindable, inlineView } from 'aurelia-framework';

@inlineView('<template><slot></slot></template>')
export class GridColumnCustomElement {

  @bindable asyncPostRender = undefined;
  @bindable behavior = undefined;
  @bindable cannotTriggerInsert = undefined;
  @bindable cssClass = '';
  @bindable defaultSortAsc = true;
  @bindable editor = undefined; 
  @bindable field = ''; 
  @bindable focusable = true;
  @bindable formatter = undefined;
  @bindable headerCssClass = undefined;
  @bindable id = '';
  @bindable maxWidth = undefined;
  @bindable minWidth = undefined;
  @bindable name = null;
  @bindable rerenderOnResize = false;
  @bindable resizable = true;
  @bindable selectable = true;
  @bindable sortable = false;
  @bindable tooltip = '';
  @bindable width = undefined;
  @bindable allOptions; // useful if data is saved in a object
  @bindable onClick;
  @bindable onCellChange;

  static inject = [ Element, GridCustomElement, BindingEngine ];

  constructor(element, grid, bindingEngine) {
    this.element = element;
    this._options = {};
    this._grid = grid;
    this._subscriptions = [];
    this._index = null;

    this._subscription = bindingEngine
      .propertyObserver(this.element, 'firstElementChild')
      .subscribe(this._slotRendered.bind(this));
  }

  // must be called @ bind before grid is attached
  bind(bindingContext) {
    this._events = {
      onClick: this._onClick,
      onCellChange: this._onCellChange
    }

    this._options = Object.assign({}, {
      asyncPostRender: this.asyncPostRender,
      behavior: this.behavior,
      cannotTriggerInsert: this.cannotTriggerInsert,
      cssClass: this.cssClass,
      defaultSortAsc: this.defaultSortAsc,
      editor: Editors[this.editor],
      field: this.field, 
      focusable: this.focusable,
      formatter: Formatters[this.formatter],
      headerCssClass: this.headerCssClass,
      id: this.id || this.field,
      maxWidth: this.maxWidth,
      minWidth: this.minWidth,
      name: this.name === null ? this.field.charAt(0).toUpperCase() + this.field.slice(1) : this.name,
      rerenderOnResize: this.rerenderOnResize,
      resizable: this.resizable,
      selectable: this.selectable,
      sortable: this.sortable,
      tooltip: this.tooltip,
      width: this.width
    }, this.allOptions);

    this._grid.addColumn(this._options);
    this._bindingContext = bindingContext;
  }

  attached() {
    for (let i = 0; i < this.element.parentNode.children.length; i++) {
      if (this.element.parentNode.children[i] === this.element) {
        this._index = i;
        break;
      }
    }

    for (let e in this._events) {
      if (this[e]) {
        const subscriptionFn = this._events[e].bind(this)
        this._subscriptions.push({ [e]: subscriptionFn });
        this._grid.grid[e].subscribe(subscriptionFn);
      }
    }
  }

  detached() {
    this._subscription.dispose();

    for (let sub of this._subscriptions) {
      const eventName = Object.keys(sub)[0];
      this._grid.grid[eventName].unsubscribe(sub[eventName]);
    }
  }

  _onClick(e, args) {
    this._callHandler(e, args, 'onClick');
  }

  _onCellChange(e, args) {
    this._callHandler(e, args, 'onCellChange');
  }

  _callHandler(e, args, handler) {
    if (args.cell === this._index) {
      const item = args.grid.getData().getItem(args.row)
      this[handler].call(this._bindingContext, item);
    }
  }

  _slotRendered() {
    const child = this.element.firstElementChild;

    const columns = this._grid.grid.getColumns();
    const columnData = columns.find(c => c.field === this._options.field);
    columnData.formatterOpts.html = child.outerHTML;
    columnData.formatter = Formatters.Html;
    this._grid.grid.setColumns(columns);
  }
}
