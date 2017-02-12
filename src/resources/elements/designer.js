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

  attached() {
    // use this type of iterating because having issues with unit tetsts
    for (let i = 0; i < this.element.children.length; i++) {
      this._enhance(this.element.children[i]);
    }
  }

  setDraggablePosition(event) {
    const pos = event.detail.position;
    const target = event.target;

    target.style.top = `${pos.top}px`;
    target.style.bottom = `${pos.bottom}px`;
    target.style.right = `${pos.right}px`;
    target.style.left = `${pos.left}px`;
    target.style.height = `${pos.height}px`;
    target.style.width = `${pos.width}px`;
  }

  createElement(model) { 
    const elementRenderer = this._renderer[model.type];

    if (!elementRenderer) {
      throw new Error(`Renderer not found for ${model.type}`);
    }

    const randomId = _genRandomId();

    const draggable = elementRenderer(model.options);
    draggable.id = randomId;

    // TODO key press for copy and delete
    draggable.ondblclick = e => this._onEditElement(draggable);
    draggable.onkeyup = e => this._copyPaste(e, draggable);

    draggable.setAttribute('draggable', '#page-host');
    draggable.setAttribute('draggable-dragdone.delegate', 'setDraggablePosition($event)');
    draggable.setAttribute('data-element-type', model.type);
    this.element.appendChild(draggable);

    this._enhance(draggable);

    return draggable;
  }

  _onEditElement(elem) {
    const editing = new CustomEvent('onedit', {
      bubbles: true,
      detail: { model: { id: elem.id } } }
    )

    this.element.dispatchEvent(editing);
  }

  // TODO make attribute
  _copyPaste(event, draggable) {
    if (event.key === 'c' && event.ctrlKey) {
      const model = { type: draggable.getAttribute('data-element-type') };
      this._onEditElement(model);
    }
  }

  _enhance(element) {
    this._templateEngine.enhance({
      element,
      bindingContext: this,
      resources: this._view.resources
    });
  }
}

// TODO move to utils
function _genRandomId() {
  let randomId;
  do {
    randomId = Math.floor((Math.random() * 1000) + 1);
  } 
  while(DOM.getElementById(randomId));

  return randomId;
}
