import { customElement, bindable, TemplatingEngine, inlineView } from 'aurelia-framework';
import { randomId, setDefaultVal } from '../../utils';
import { DOM } from 'aurelia-pal';
import * as renderers from '../../renderers/index';

@customElement('designer')
@inlineView(`
<template>
  <require from="../attributes/draggable"></require>
  <require from="../attributes/resizable"></require>
</template>
`)
export class DesignerCustomElement {

  static inject() { return [ Element, TemplatingEngine ]; }

  @bindable formstyle;
  @bindable interact;

  constructor(element, templateEngine) {
    this.element = element;
    this.resize = false;
    this.drag = false;

    // need to keep this on the class to bind to the attribute
    this.dragOptions = {
      restriction: '#page-host',
      enabled: true
    };

    this._templateEngine = templateEngine;
    this._formWrapper = null;
    this._view = null;
    this._renderer = null;
  }

  created(owningView, thisView) {
    this._view = thisView;
  }

  bind(bindingContext, overrideContext) {
    this._renderer = renderers[this.formstyle];

    if (!this._renderer) {
      throw new Error(`Formstyle not found for ${this.formstyle}`);
    }

    // make sure there always is a form wrapper
    this._formWrapper = this.element.querySelector('form');

    if (!this._formWrapper) {
      this._formWrapper = DOM.createElement('form');

      // if there is html without a form wrapper, wrap it all in a form
      if (this.element.innerHTML) {
        this._formWrapper.innerHTML = this.element.innerHTML;
        this.element.innerHTML = '';
      }

      this.element.appendChild(this._formWrapper);
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

    draggable.setAttribute('draggable.bind', 'dragOptions');
    draggable.setAttribute('resizable.bind', 'resize');
    draggable.setAttribute('data-element-type', model.type);
    this._formWrapper.appendChild(draggable);

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
    element.ondblclick = e => this._onEditElement(element);
    element.onchange = e => setDefaultVal(e.target);
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
