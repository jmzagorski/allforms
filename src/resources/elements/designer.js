import { customElement, bindable, TemplatingEngine } from 'aurelia-framework';
import { randomId } from '../../utils';
import { DOM } from 'aurelia-pal';
import * as renderers from '../../renderers/index';

@customElement('designer')
export class DesignerCustomElement {

  static inject() { return [ Element, TemplatingEngine ]; }

  @bindable template;
  @bindable formstyle;
  @bindable interact;
  element;
  resize = false;
  drag = true;

  _templateEngine;
  _view;
  _renderer;

  constructor(element, templateEngine) {
    this.element = element;
    this._templateEngine = templateEngine;

    // need to keep this on the class to bind to the attribute
    this.dragOptions = {
      restriction: '#page-host',
      enabled: true
    };
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

    draggable.setAttribute('draggable.bind', 'dragOptions');
    draggable.setAttribute('resizable.bind', 'resize');
    draggable.setAttribute('data-element-type', model.type);
    this.element.appendChild(draggable);

    this._enhance(draggable);

    return draggable;
  }

  interactChanged(newVal, oldVal) {
    this.resize = newVal === 'resize';
  }

  _onEditElement(elem) {
    const editing = new CustomEvent('onedit', {
      bubbles: true,
      detail: { model: { id: elem.id } } }
    )

    this.element.dispatchEvent(editing);
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
  let id;
  do {
    id = randomId();
  } 
  while(DOM.getElementById(id));

  return id;
}
