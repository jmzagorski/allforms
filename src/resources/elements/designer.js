import {interact} from 'interactjs';
import {customElement, inject, bindable} from 'aurelia-framework';
import {DOM} from 'aurelia-pal';


function _dragMoveListener (event) {
  const target = event.target;
  // keep the dragged position in the data-x/data-y attributes
  const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
  const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  // translate the element
  target.style.webkitTransform = target.style.transform = 
    'translate(' + x + 'px, ' + y + 'px)';

  // update the posiion attributes
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

function _createDropZone() {
  // enable draggables to be dropped into this
  interact('.dropzone').dropzone({
    // only accept elements matching this CSS selector
    accept: '.drag-drop',
    // Require a 75% element overlap for a drop to be possible
    overlap: 0.75,

    // listen for drop related events:
    ondropactivate: function (event) {
      // add active dropzone area
      event.target.classList.add('drop-active');
    },
    ondropdeactivate: function (event) {
      // remove active dropzone feedback
      event.target.classList.remove('drop-active');
    }
  });
}

function _createDraggable(boundary) {
  interact('.draggable')
    .draggable({
      inertia: true,
      restrict: {
        restriction: boundary,
        endOnly: true,
        elementRect: { top: 0, left: 0, bottom: 0, right: 0 }
      },
      onmove: _dragMoveListener
    });
}

@customElement('designer')
@inject(Element)
export class DesignerCustomElement {

  @bindable boundary;

  constructor(element) {
    this.element = element;
    this.formElement = null;
    this.dropzone = null;
    this._view = null;
  }

  showElement() {
    const draggable = DOM.createElement(this.formElement); 

    draggable.className = `draggable drag-drop resizable`;
    this.element.insertBefore(draggable, this.dropzone);
    this.formElement = "";
  }

  created(view) {
    _createDropZone();
    this._view = view;
  }

  bind(bindingContext, overrideContext) {
    _createDraggable(this.boundary || this._view);
    this._view = null;
  }

  attached() {
    this.dropzone = this.element.querySelector('.dropzone');
  }

  detached() {}

  unbind() {}
}
