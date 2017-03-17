import { customElement, bindable, TemplatingEngine, inlineView } from 'aurelia-framework';
import { setDefaultVal } from '../../utils';
import { DOM } from 'aurelia-pal';

const DATA_ELEM_TYPE = 'data-element-type';

@customElement('designer')
@inlineView(`
<template>
  <require from="../attributes/draggable"></require>
  <require from="../attributes/resizable"></require>
  <require from="../attributes/dropzone"></require>
</template>
`)
export class DesignerCustomElement {

  static inject() { return [ Element, TemplatingEngine ]; }

  @bindable formstyle;
  @bindable interact;
  @bindable formid

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
  }

  created(owningView, thisView) {
    this._view = thisView;
  }

  bind(bindingContext, overrideContext) {
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

    this._formWrapper.id = this.formid
  }

  attached() {
    // use this type of iterating because having issues with unit tetsts
    for (let i = 0; i < this._formWrapper.children.length; i++) {
      this._enhance(this._formWrapper.children[i]);
    }
  }

  createElement(model) {
    const $existing = DOM.getElementById(model.id);

    if ($existing) {
      return model.mutate ? model.mutate($existing) : model.create($existing);
    }

    const $draggable = model.create();
    $draggable.id = model.id;

    $draggable.setAttribute('draggable.bind', 'dragOptions');
    $draggable.setAttribute('resizable.bind', 'resize');
    $draggable.setAttribute(DATA_ELEM_TYPE, model.elementType);
    this._formWrapper.appendChild($draggable);

    this._enhance($draggable);

    return $draggable;
  }

  interactChanged(newVal, oldVal) {
    this.resize = newVal === 'resize';
  }

  /**
   * @summary dispatches an onedit event when an element's metadata should be
   * edited
   * @desc this methods does not perform the editing, but just sends out the
   * event so listeneres can act upon the event. In this class the ondblclick is
   * fired, which is a signal that the client wants to edit the metadata
   * @param {Object} event the event object
   *
   */
  _onEditElement(elem) {
    const editing = new CustomEvent('onedit', {
      bubbles: true,
      detail: {
        model: {
          id: elem.id,
          type: elem.getAttribute(DATA_ELEM_TYPE)
        }
      }
    });

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
