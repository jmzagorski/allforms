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

export class DraggableCustomAttribute {
  static inject() { return [ Element, Interact ]; }

  constructor(element, interact) {
    this.element = element;
    this.defaults = {
      enabled: true,
      restriction: 'body',
      onend: null,
      onstart: null,
    };
    this._interact = interact;
    this._interactable = null;

    this.element.classList.add('draggable');
  }

  // TODO - how to observe the enabled property to turn this on and off
  bind() {
    this.value = this.value || this.defaults;

    this._interactable = this._interact(this.element);

    this._interactable.draggable({
      enabled: this.value.enabled,
      inertia: true,
      restrict: {
        restriction: this.value.restriction,
        endOnly: true,
        elementRect: { top: 0, left: 0, bottom: 0, right: 0 }
      },
      onmove: dragHandler,
      onend: this.value.onend,
      onstart: this.value.onstart
    });
  }

  unbind() {
    if (this._interactable) this._interactable.unset();
  }
}
