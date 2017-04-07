import stampit from  'stampit';
import { DOM } from 'aurelia-pal';
import map from './viewMap';

const defaults = stampit()
  .props({
    size: 1,
    text: '',
    sizes: [1, 2, 3, 4, 5, 6]
  });

const metadata = stampit()
  .props({
    schema: [ map.text, map.header ]
  });

export const standard = stampit()
  .methods({
    create() {
      const $header = DOM.createElement(`h${this.size}`);
      $header.textContent = this.text;
      return $header;
    }
  })
  .compose(defaults, metadata);
