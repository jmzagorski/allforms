import $ from 'jquery';
import * as Interact from 'interact.js';

function ondragenter(event) {
  event.target.classList.add('drop-target');
}

function ondragleave(event) {
  const dropping = event.relatedTarget;
  event.target.classList.remove('drop-target');

  dropping.style.webkitTransform = dropping.style.transform = null;

  let parent = event.target;
  while(!parent.getAttribute('data-x')) {
    parent = parent.parentNode;
  }

  const x = parseInt(parent.getAttribute('data-x')) + parseInt(dropping.getAttribute('data-x'));
  const y = parseInt(parent.getAttribute('data-y')) + parseInt(dropping.getAttribute('data-y'));

  // if we used the parent it would be the target element which is already the
  // drop zone 
  parent.parentNode.appendChild(dropping);

  dropping.setAttribute('data-x', x)
  dropping.setAttribute('data-y', y);
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
