import stampit from  'stampit';
import { DOM } from 'aurelia-pal';
import map from './viewMap';

const defaults = stampit()
  .props({
    name: '',
    text: '',
    type: '',
    variables: '' ,
    types: [],
    calculation: null
  });

const metadata = stampit()
  .props({
    schema: [ map.text, map.name, map.types, map.formula ]
  });

export const bootstrap = stampit()
  .init(function() {
    this.types = [ '', 'info', 'success', 'danger', 'warning' ]; 
  })
  .methods({
    create($element) {
      const $wrapper = $element || DOM.createElement('span');
      const $output = $wrapper.querySelector('output') || DOM.createElement('output');
      $wrapper.textContent = this.text;

      // remove the alert class first
      $wrapper.className = $wrapper.className.replace(/\balert\b\s\balert-[a-z]+\b(\s|$)/, '');

      if (this.type) {
        $wrapper.className += `alert alert-${this.type}`.trim();
      }

      $output.name = this.name;
      $output.textContent = this.calculation;
      $output.htmlfor = this.variables;

      $wrapper.appendChild($output);

      return $wrapper;
    },
    getCalculation(e) {
      this.calculation = e.detail.result;
      this.variables = e.detail.variables.join(' ');
    }
  })
  .compose(defaults, metadata);
