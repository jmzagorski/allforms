import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.min.js';

export class TooltipCustomAttribute {

  static inject() { return [ Element ]; }

  constructor(element) {
    this.element = element;
  }

  bind() {
    $(this.element).tooltip();

    this.element.setAttribute('data-toggle', 'tooltip');
    this.element.setAttribute('data-placement', this.value.placement || 'top');
    this.element.setAttribute('title', this.value.message);
  }
}
