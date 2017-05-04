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
    create($element) {
      let $header = DOM.createElement(`h${this.size}`);

      // TODO need to copy attributes and what not
      // need to replace the entire element if different size
      // else just set the text
      if ($element) {
        if ($element.tagName !== $header.tagName) {
          $element.parentNode.replaceChild($header, $element);
        } else {
          $header = $element;
        }
      }

      $header.textContent = this.text;
      return $header;
    }
  })
  .compose(defaults, metadata);
