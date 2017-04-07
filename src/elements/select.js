import stampit from  'stampit';
import { parseCsv } from '../utils';
import { DOM } from 'aurelia-pal';
import map from './viewMap';

const defaults = stampit()
  .props({
    required: false,
    name: '',
    text: '',
    optionSrc: null 
  });

const metadata = stampit()
  .props({
    schema: [ map.text, map.name, map.input, map.file ]
  });

export const bootstrap = stampit()
  .methods({
    create($element) {
      return $element ? this._mutate($element) : this._create();
    },
    _create() {
      const $formGroup = DOM.createElement('div');
      const $label = DOM.createElement('label');
      const $select = DOM.createElement('select');
      $formGroup.className = 'form-group';
      $select.className = 'form-control';
      $formGroup.appendChild($label);
      $formGroup.appendChild($select);

      this._mutate($formGroup);

      return $formGroup;
    },
    _mutate($element) {
      const $label = $element.querySelector('label');
      const $select = $element.querySelector('select');

      $select.name = this.name;
      $select.required = this.required;
      $label.textContent = this.text;

      if (this.optionSrc) {
        const fr = new FileReader();
        fr.readAsText(this.optionSrc[0]);
        fr.onload = () => {
          const data = parseCsv(fr.result, '\n', ',');
          for (let i = 0; i < data.length; i++) {
            // +1 because of the default above
            $select.options[i] = new Option(data[i][1], data[i][0]);
          }
        };
      }

      return $element;
    }
  })
  .compose(defaults, metadata);
