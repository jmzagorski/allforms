import stampit from  'stampit';
import { DOM } from 'aurelia-pal';
import map from './viewMap';

const defaults = stampit()
  .props({
    text: '',
    href: '#/'
  });

const metadata = stampit()
  .props({
    schema: [ map.href, map.text ]
  });

export const standard = stampit()
  .methods({
    create($element) {
      const $link = $element || DOM.createElement('a');
      $link.onclick = e => e.preventDefault();
      $link.href = this.href;
      $link.textContent = this.text;
      return $link;
    }
  })
  .compose(defaults, metadata);
