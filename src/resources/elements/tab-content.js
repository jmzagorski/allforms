import { inlineView } from 'aurelia-templating';
import { TabGroupCustomElement } from './tab-group';
import { Store } from 'aurelia-redux-plugin';
import {
  bindable,
  customElement,
  containerless
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

  static inject() { return [ TabGroupCustomElement ]; }

  @bindable header;

  constructor(tabGroup) {
    this._tabGroup = tabGroup;
    this.active = false;
  }

  bind() {
    this._tabGroup.addTab(this);
  }
}
