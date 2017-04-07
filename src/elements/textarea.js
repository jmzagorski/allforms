import stampit from  'stampit';
import { DOM } from 'aurelia-pal';
import map from './viewMap';

const defaults = stampit()
  .props({
    name: '',
    required: false,
    text: '',
    rows: 5
  });

const metadata = stampit()
  .props({
    schema: [ map.text, map.name, map.input, map.textarea ]
  });

export const bootstrap = stampit()
  .methods({
    create($element) {
      return $element ? this._mutate($element) : this._create();
    },
    _create() {
      const $formgroup = DOM.createElement('div');
      const $label = DOM.createElement('label');
      const $text = DOM.createElement('textarea');

      $formgroup.className = 'form-group';
      $text.className = 'form-control';

      $formgroup.appendChild($label);
      $formgroup.appendChild($text);

      this._mutate($formgroup);

      return $formgroup;
    },
    _mutate($element) {
      const $label = $element.querySelector('label');
      const $text = $element.querySelector('textarea');

      $label.textContent = this.text;
      $text.rows = this.rows;
      $text.name = this.name;
      $text.required = this.required;

      return $element;
    }
  })
  .compose(defaults, metadata);
