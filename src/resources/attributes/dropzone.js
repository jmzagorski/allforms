import * as Interact from 'interact.js';

function ondropactivate(event) {
  event.target.classList.add('drop-active');
}

function ondropdeactivate(event) {
  event.target.classList.remove('drop-active');
}

export class DropzoneCustomAttribute {

  static inject() { return [ Element, Interact ]; }

  constructor(element, interact) {
    this.element = element;

    element.classList.add('dropzone');

    this._interactable = interact(this.element).dropzone({
      ondropactivate,
      ondropdeactivate
    });
  }

  unbind() {
    if (this._interactable) this._interactable.unset();
  }
}
