import stampit from  'stampit';
import { DOM } from 'aurelia-pal';
import map from './viewMap';

const defaults = stampit()
  .props({
    text: '',
    context: '',
    contexts: []
  });

const metadata = stampit()
  .props({
    schema: [ map.text, map.contexts ]
  });

export const bootstrap = stampit()
  .init(function() {
    this.contexts = [ 'primary', 'info', 'success', 'danger', 'warning' ];
  })
  .methods({
    create($element) {
      const $label = $element || DOM.createElement('span');
      const className = $label.className.replace(/\blabel\b\s\blabel-[a-z]+\b(\s|$)/, '');
      $label.className = `${className} label label-${this.context}`.trim();
      $label.textContent = this.text;
      $label.style.fontSize = '1em';
      return $label;
    }
  })
  .compose(defaults, metadata);
