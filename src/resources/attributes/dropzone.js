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
  const dropping = event.relatedTarget;
  const zone = event.target;

  // prevent parent from being dropped in child
  if ($(dropping).find(zone).length) {
    return;
  }

  // TODO can i set the transformation relative to the drop zone parent
  // this is to prevent a bug to can move the element off screen after the
  // drop
  if (dropping.parentNode !== zone) {
    dropping.style.webkitTransform = dropping.style.transform = null;

    dropping.setAttribute('data-x', 0);
    dropping.setAttribute('data-y', 0);

    zone.appendChild(dropping);
  }
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
