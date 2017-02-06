import { inlineView } from 'aurelia-templating';
import { TabGroupCustomElement } from './tab-group';
import {
  bindable,
  customElement,
  containerless,
  computedFrom
} from 'aurelia-framework';

//needs to be containerless or the bootstrap tab-content won't work
@containerless()
@inlineView(`
<template>
  <div show.bind="active" class="tab-pane fade \${active ? 'in active' : ''}">
    <slot></slot>
  </div>
</template>`
)
@customElement('tab-content')
export class TabContentCustomElement {

  static inject() { return [ Element, TabGroupCustomElement ]; }

  @bindable header;

  constructor(element, tabGroup) {
    this.element = element;

    this._tabGroup = tabGroup;
    this._active = false;
  }

  @computedFrom('_active')
  get active() { return this._active; }

  set active(value) {
    if (value) this._onActivated();
    this._active = value;
  }

  bind() {
    this._tabGroup.addTab(this);
  }

  detached() {
    this._tabGroup.removeTab(this);
  }

  _onActivated() {
    const activated = new CustomEvent('activate', {
      bubbles: true,
      detail: {
        header: this.header,
        index: this._tabGroup.tabs.indexOf(this)
      }
    });

    this.element.dispatchEvent(activated);
  }
}
