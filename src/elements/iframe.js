import stampit from  'stampit';
import { DOM } from 'aurelia-pal';
import map from './viewMap';

const defaults = stampit()
  .props({
    href: '#/',
    width: 700,
    height: 300
  });

const metadata = stampit()
  .props({
    schema: [ map.href, map.iframe ]
  });

export const standard = stampit()
  .methods({
    create($element) {
      const $iframe = $element || DOM.createElement('iframe');
      $iframe.src = this.href;
      $iframe.width = this.width;
      $iframe.height = this.height;
      return $iframe;
    }
  })
  .compose(defaults, metadata);
