import $ from 'jquery';
import * as Interact from 'interact.js';

// TODO bug blue stays
function ondragenter(event) {
  event.target.classList.add('drop-target');
}

function ondragleave(event) {
  event.target.classList.remove('drop-target');
}

function ondropactivate(event) {
  event.target.classList.add('drop-active');
}

function ondropdeactivate(event) {
  event.target.classList.remove('drop-active');
  event.target.classList.remove('drop-target');
}

function ondrop(event) {
  // prevent parent from being dropped in child
  if ($(event.relatedTarget).find(event.target).length) {
    return;
  }

  // TODO - bug element moves after drop
  event.target.appendChild(event.relatedTarget);
}

export class DropzoneCustomAttribute {

  static inject() { return [ Element, Interact ]; }

  constructor(element, interact) {
    this.element = element;

    element.classList.add('dropzone');

    this._interactable = interact(this.element).dropzone({
      ondropactivate,
      ondropdeactivate,
      ondragenter,
      ondragleave,
      ondrop
    });
  }

  unbind() {
    if (this._interactable) this._interactable.unset();
  }
}
