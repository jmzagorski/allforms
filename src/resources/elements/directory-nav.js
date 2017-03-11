import { EventAggregator } from 'aurelia-event-aggregator';
import { buildLocationLinks } from '../../utils';
import { PLATFORM } from 'aurelia-pal';
import { customElement, bindable, inlineView } from 'aurelia-framework';

@customElement('directory-nav')
@inlineView(`
<template>
  <ul class="breadcrumb">
    <li repeat.for="s of segments"><a href="\${s.url}">\${s.display}</a></li>
  </ul>
</template>`)
export class DirectoryNavCustomElement {

  static inject() { return [ EventAggregator ];}

  @bindable rootName;

  constructor(eventAggregator) {
    this.segments = [];
    this._eventAggregator = eventAggregator;
    this._subscription = null;
  }

  navigationSuccess(event) {
    this.segments = buildLocationLinks(PLATFORM.location, 1);

    // for custom root dir naming instead of / or whatever it is
    const root = event.instruction.router.options.root || '/';
    const rootSeg = {
      url: PLATFORM.location.hash ? `${root}#` : root,
      display: this.rootName
    };
    this.segments.unshift(rootSeg);
  }

  bind() {
    this._subscription = this._eventAggregator.subscribe(
      'router:navigation:success',
      this.navigationSuccess.bind(this)
    );
  }

  detached() {
    this._subscription.dispose();
    this.segments = [];
  }
}
