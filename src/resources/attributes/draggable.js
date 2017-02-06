import * as renderers from '../../renderers/index';
import * as Interact from 'interact.js';

function dragHandler(event) {
  const target = event.target;
  // keep the dragged position in the data-x/data-y attributes
  const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
  const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  // translate the element
  target.style.webkitTransform = target.style.transform =
    'translate(' + x + 'px, ' + y + 'px)';

  // update the position attributes
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

function dragEndHandler(event) {
  const element = event.target;
  const position = element.getBoundingClientRect();

  element.dispatchEvent(
    new CustomEvent('draggable-dragdone', {
      bubbles: true,
      detail: { position },
    })
  );
}

export class DraggableCustomAttribute {
  static inject() { return [ Element, Interact ]; }

  constructor(element, interact) {
    this.element = element;
    this._interact = interact;
    this._interactable = null;

    this.element.classList.add('draggable');
  }

  bind() {
    this._interactable = this._interact(this.element).draggable({
      inertia: true,
      restrict: {
        restriction: this.value,
        endOnly: true,
        elementRect: { top: 0, left: 0, bottom: 0, right: 0 }
      },
      onmove: dragHandler,
      onend: dragEndHandler
    });
  }

  unbind() {
    if (this._interactable) this._interactable.unset();
  }
}
