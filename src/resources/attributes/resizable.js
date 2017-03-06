import * as Interact from 'interact.js';

function resizeHandler(event) {
  var target = event.target;

  // update the element's style
  target.style.width  = event.rect.width + 'px';
  target.style.height = event.rect.height + 'px';
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
    }).on('resizemove', resizeHandler)
  }

  valueChanged(newVal, oldVal) {
    this._interactable.options.resize.enabled = newVal;
  }

  unbind() {
    if (this._interactable) this._interactable.unset();
  }
}
