import * as Interact from 'interact.js';

function resizeHandler(event) {
  const target = event.target;
  let x = (parseFloat(target.getAttribute('data-x')) || 0);
  let y = (parseFloat(target.getAttribute('data-y')) || 0);

  // update the element's style
  target.style.width  = event.rect.width + 'px';
  target.style.height = event.rect.height + 'px';

  // translate when resizing from top or left edges
  x += event.deltaRect.left;
  y += event.deltaRect.top;

  target.style.webkitTransform = target.style.transform = `translate(${x}px,${y}px)`;

  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

export class ResizableCustomAttribute {
  static inject() { return [ Element, Interact ]; }

  constructor(element, interact) {
    this.element = element;
    this._interact = interact;

    this.element.classList.add('resizable');
  }

  bind() {
    this._interactable = this._interact(this.element).resizable({
      enabled: this.value,
      edges: { left: true, right: true, bottom: true, top: true }
    }).on('resizemove', resizeHandler);
  }

  valueChanged(newVal, oldVal) {
    this._interactable.options.resize.enabled = newVal;
  }

  unbind() {
    if (this._interactable) this._interactable.unset();
  }
}
