import stampit from  'stampit';
import { DOM } from 'aurelia-pal';
import map from './viewMap';

const defaults = stampit()
  .props({
    name: '',
    text: '',
    context: '',
    relations: [],
    contexts: [],
    value: null,
    formula: '',
    formId: ''
  });

const metadata = stampit()
  .props({
    schema: [ map.text, map.name, map.contexts, map.formula ]
  });

export const bootstrap = stampit()
  .init(function() {
    this.contexts = [ '', 'info', 'success', 'danger', 'warning' ]; 
  })
  .methods({
    create($element) {
      const $wrapper = $element || DOM.createElement('span');
      const $output = $wrapper.querySelector('output') || DOM.createElement('output');
      $wrapper.textContent = this.text;

      // remove the alert class first
      $wrapper.className = $wrapper.className.replace(/\balert\b\s\balert-[a-z]+\b(\s|$)/, '');

      if (this.context) {
        $wrapper.className += `alert alert-${this.context}`.trim();
      }

      $output.name = this.name;
      $output.textContent = this.value;

      if (this.relations.length) {
        $output.setAttribute('for', this.relations.map(r => r.name).join(' '));
      } else {
        $output.setAttribute('for', '');
      }

      $wrapper.appendChild($output);

      return $wrapper;
    }
  })
  .compose(defaults, metadata);
