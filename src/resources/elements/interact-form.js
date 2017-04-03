import { setDefaultVal } from '../../utils';
import { bindable } from 'aurelia-framework';

const DRAGGABLE = 'draggable.bind';

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
    this._interactDefaults = {
      dragOptions: { 
        onend: e => this._emitInteractEvent(e.target)
      }
    };
  }

  bind() {
    this.$form = this.element.querySelector('form');
    this.htmlChanged(this.html, null);
    this.interactOptions = this.interactOptions || this._interactDefaults;

    // if this property is not set, make sure the defaults are set so 
    // this custom element can still emit an event
    if (this.interactOptions.dragOptions) {
      this.interactOptions.dragOptions.onend = e => this._emitInteractEvent(e.target);
    } else {
      this.interactOptions.dragOptions = this._interactDefaults.dragOptions;
    }
  }

  htmlChanged(newValue, oldValue) {
    this.interactHtml = this.$form.innerHTML = newValue;

    this._recurseChildren(this.$form);
  }

  _makeInteractable($elem) {
    $elem.setAttribute(DRAGGABLE, 'interactOptions.dragOptions');
    $elem.setAttribute('resizable.bind', 'interactOptions.resize');
    $elem.tabIndex = ++this._tabIndicies;
  }

  _addEvents($elem) {
    $elem.onchange = e => setDefaultVal(e.target);
    $elem.onkeydown = e => this._deleteElement(e);
    $elem.onclick = e => {
      e.preventDefault();
      $elem.focus();
    };
    $elem.ondblclick = e => this._emitActivateElem($elem);
  }

  _deleteElement(e) {
    if (e.target.getAttribute(DRAGGABLE) && (e.keyCode === 8 || e.keyCode == 46)) {

      e.target.parentNode.removeChild(e.target);

      this._emitInteractEvent(e.target);
    }
  }

  _emitActivateElem($elem) {
    const editing = new CustomEvent('onactivate', {
      bubbles: true,
      detail: { $elem }
    });

    this.element.dispatchEvent(editing);
  }

  _emitInteractEvent($elem) {
    const editing = new CustomEvent('oninteract', {
      bubbles: true,
      detail: {
        formHtml: this.$form.outerHTML,
        elementHtml: $elem.outerHTML,
        elementId: $elem.id
      }
    });

    this.element.dispatchEvent(editing);
  }

  _recurseChildren($elem) {
    for (let i = 0; i < $elem.children.length; i++) {
      const child = $elem.children[i];
      if (!child.ondblclick) this._addEvents(child);
      if (!child.getAttribute(DRAGGABLE)) this._makeInteractable(child);
      this._addEvents(child);
    }
  }
}
