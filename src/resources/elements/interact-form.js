import { setDefaultVal } from '../../utils';
import { bindable } from 'aurelia-framework';

const DRAGGABLE = 'draggable.bind';

export const EVENTS = {
  valset: 'valset',
  dblclick: 'dblclick',
  move: 'move',
  delete: 'delete'
};

export class InteractFormCustomElement {

  @bindable html = '';
  @bindable interactOptions = {};
  @bindable id;
  @bindable action;
  @bindable method;

  static inject = [ Element ];

  constructor(element) {
    this.element = element;
    this.interactHtml = '';
    this._tabIndicies = 0;
    this._defaulOpts = {
      dragOptions: { 
        onend: e => this._emitInteractEvent(e.target, EVENTS.move)
      }
    };
  }

  bind() {
    this.$form = this.element.querySelector('form');
    this.htmlChanged(this.html, null);
    this._setDefaults();
  }

  htmlChanged(newValue, oldValue) {
    this.interactHtml = this.$form.innerHTML = newValue;

    for (let i = 0; i < this.$form.children.length; i++) {
      const child = this.$form.children[i];
      if (!child.ondblclick) this._addEvents(child);
      if (!child.getAttribute(DRAGGABLE)) this._makeInteractable(child);
    }
  }

  _setDefaults() {
    this.interactOptions = this.interactOptions || this._defaulOpts;

    // if this property is not set, make sure the defaults are set so 
    // this custom element can still emit an event
    if (this.interactOptions.dragOptions) {
      this.interactOptions.dragOptions.onend = this._defaulOpts.dragOptions.onend;
    } else {
      this.interactOptions.dragOptions = this._defaulOpts.dragOptions;
    }
  }

  _makeInteractable($elem) {
    $elem.setAttribute(DRAGGABLE, 'interactOptions.dragOptions');
    $elem.setAttribute('resizable.bind', 'interactOptions.resize');
    $elem.tabIndex = ++this._tabIndicies;
  }

  _addEvents($elem) {
    $elem.onchange = e => {
      setDefaultVal(e.target);
      this._emitInteractEvent(e.target, EVENTS.valset);
    }
    $elem.onkeydown = e => this._deleteElement(e.keyCode, $elem);
    $elem.onclick = e => {
      e.preventDefault();
      $elem.focus();
    };
    $elem.ondblclick = e => this._emitInteractEvent($elem, EVENTS.dblclick);
  }

  _deleteElement(keycode, $interactable) {
    if (keycode === 8 || keycode == 46) {

      $interactable.parentNode.removeChild($interactable);

      this._emitInteractEvent($interactable, EVENTS.delete);
    }
  }

  _emitInteractEvent($elem, type) {
    const interactEvent = new CustomEvent('oninteract', {
      bubbles: true,
      detail: { type, $elem, $form: this.$form }
    });

    this.element.dispatchEvent(interactEvent);
  }
}
