import { customElement, bindable, TemplatingEngine } from 'aurelia-framework';
import { DOM } from 'aurelia-pal';
import * as renderers from '../../renderers/index';

@customElement('designer')
export class DesignerCustomElement {

  static inject() { return [ Element, TemplatingEngine ]; }

  @bindable template;
  @bindable formstyle;
  element

  _templateEngine;
  _view;
  _renderer;

  constructor(element, templateEngine) {
    this.element = element;
    this._templateEngine = templateEngine;
  }

  created(owningView, thisView) {
    this._view = thisView;
  }

  bind(bindingContext, overrideContext) {
    this._renderer = renderers[this.formstyle];

    if (!this._renderer) {
      throw new Error(`Formstyle not found for ${this.formstyle}`);
    }
  }

  onEditElement(elem) {
    const editing = new CustomEvent('onedit',
      { bubbles: true, detail: { model: { id: elem.id } } }
    )

    this.element.dispatchEvent(editing);
  }

  setDraggablePosition(event) {
    const pos = event.detail.position;
    const target = event.target;

    target.style.top = pos.top;
    target.style.bottom = pos.bottom;
    target.style.right = pos.right;
    target.style.left = pos.left;
    target.style.height = pos.height;
    target.style.width = pos.width;

    this.onSave();
  }

  createElement(model) { 
    const elementRenderer = this._renderer[model.type];

    if (!elementRenderer) {
      throw new Error(`Renderer not found for ${model.type}`);
    }

    let randomId;
    do {
      randomId = Math.floor((Math.random() * 1000) + 1);
    } 
    while(DOM.getElementById(randomId));

    const draggable = elementRenderer(model.options);
    draggable.id = randomId;

    // TODO key press for copy and delete
    draggable.ondblclick = e => this.onEditElement(draggable);

    draggable.setAttribute('draggable', '#page-host');
    draggable.setAttribute('draggable-dragdone.delegate', 'setDraggablePosition($event)');
    this.element.appendChild(draggable);

    this._templateEngine.enhance({
      element: draggable,
      bindingContext: this,
      resources: this._view.resources
    });

    return draggable;
  }
}
