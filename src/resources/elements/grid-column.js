import Editors from './grid-editors';
import { CompositeFormatter } from './grid/index';
import { processContent, TargetInstruction, bindable, inlineView } from 'aurelia-framework';

// slots are not rendered until after the grid is initialzes, but i need the
// html when the grid column is attached
function getSlot(compile, resources, element, instruction) {
  instruction.template = element.innerHTML;
}

@inlineView('<template><slot></slot></template>')
@processContent(getSlot)
export class GridColumnCustomElement {

  @bindable asyncPostRender = undefined;
  @bindable behavior = undefined;
  @bindable cannotTriggerInsert = undefined;
  @bindable cssClass = '';
  @bindable defaultSortAsc = true;
  @bindable editor = undefined; 
  @bindable field = ''; 
  @bindable focusable = true;
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
  @bindable formatters = [];
  @bindable allOptions; // useful if data is saved in a object
  @bindable onClick;
  @bindable onCellChange;

  static inject = [ Element, TargetInstruction, CompositeFormatter ];

  constructor(element, instruction, compositeFormatter) {
    this.element = element;
    this.subscriptions = [];
    this.options = {};

    this._compositeFormatter = compositeFormatter;
    this._index = null;
    this._customOpts = { formatters: [] };
    this._slot = instruction.elementInstruction.template;
  }

  bind(bindingContext) {
    for (let formatter of this.formatters) {
      this._customOpts.formatters.push(formatter);
    }

    if (this._slot) {
      this._customOpts.html = this._slot;
      this._customOpts.formatters.push('Html')
    }

    this._events = {
      onClick: this._onClick,
      onCellChange: this._onCellChange
    }

    this._bindingContext = bindingContext;

    this.options = Object.assign({}, {
      asyncPostRender: this.asyncPostRender,
      behavior: this.behavior,
      cannotTriggerInsert: this.cannotTriggerInsert,
      cssClass: this.cssClass,
      defaultSortAsc: this.defaultSortAsc,
      editor: Editors[this.editor],
      field: this.field, 
      focusable: this.focusable,
      formatter: this._compositeFormatter.format.bind(this._compositeFormatter),
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
      width: this.width,
      custom: this._customOpts,
    }, this.allOptions);
  } 

  attached() {
    this._findColIndex();
    this._subscribeToEvents();
  }

  propertyChanged(propName, newVal, oldVal) {
    console.log('prop changed');
  }

  _findColIndex() {
    for (let i = 0; i < this.element.parentNode.children.length; i++) {
      if (this.element.parentNode.children[i] === this.element) {
        this._index = i;
        break;
      }
    }
  }

  _subscribeToEvents() {
    for (let e in this._events) {
      if (this[e]) {
        this.subscriptions[e] = this._events[e].bind(this);
      }
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
      const cached = JSON.stringify(item);

      this[handler].call(this._bindingContext, item);

      if (cached !== JSON.stringify(item)) {
        this.element.dispatchEvent(new CustomEvent('itemchanged', {
          bubbles: true,
          detail: item
        }));
      }
    }
  }
}
