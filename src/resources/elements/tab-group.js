import {bindable, customElement} from 'aurelia-framework';

@customElement('tab-group')
export class TabGroupCustomElement {

  @bindable type = 'tab';

  constructor() {
    this.tabs = [];
  }

  select(tab) {
    this.tabs.forEach(t => t.active = false);
    tab.active = true;
  }

  addTab(tab) {
    if (!tab) tab = { };

    if (this.tabs.length === 0) {
      tab.active = true;
    } else {
      tab.active = false;
    }

    this.tabs.push(tab);
  }
}
