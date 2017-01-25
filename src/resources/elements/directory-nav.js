import {EventAggregator} from 'aurelia-event-aggregator';
import {buildLocationLinks} from '../../utils';
import {PLATFORM} from 'aurelia-pal';
import {inlineView} from 'aurelia-templating';
import {customElement, bindable, inject} from 'aurelia-framework';

@customElement('directory-nav')
@inlineView(`
<template>
  <span class="segment" repeat.for="s of segments">
    <a href="\${s.url}">\${s.display}</a>
  </span>
</template>`)
@inject(EventAggregator)
export class DirectoryNavCustomElement {

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
