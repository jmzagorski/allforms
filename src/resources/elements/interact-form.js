import { setDefaultVal, deleteTarget } from '../../elements/services/dom-service';
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
    this.enctype = '';
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

    const $files = this.element.querySelector('input[type="file"]');

    if ($files) {
      this.enctype = 'multipart/form-data';
    } else {
      this.enctype = '';
    }

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
    };
    $elem.onkeydown = e => this._deleteInteractable(e, $elem);
    $elem.onclick = e => e.preventDefault();
    $elem.ondblclick = e => this._emitInteractEvent($elem, EVENTS.dblclick);
  }

  _deleteInteractable(event, $interactable) {
    // create a syntethic event since we do not want the target to be deleted,
    // but the interactable
    // FIXME there has to be a better way
    const deleted = deleteTarget({
      keyCode: event.keyCode,
      target: $interactable
    });

    if (deleted) this._emitInteractEvent($interactable, EVENTS.delete);
  }

  _emitInteractEvent($elem, type) {
    const interactEvent = new CustomEvent('oninteract', {
      bubbles: true,
      detail: { type, $elem, $form: this.$form }
    });

    this.element.dispatchEvent(interactEvent);
  }
}
