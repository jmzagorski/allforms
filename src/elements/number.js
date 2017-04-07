import stampit from  'stampit';
import { createInput, updateInput } from './bootstrap/input';
import map from './viewMap';

const defaults = stampit()
  .props({
    name: '',
    required: false,
    text: '',
    min: 0,
    max: null
  });

const metadata = stampit()
  .props({
    schema: [ map.text, map.name, map.range, map.input ]
  });

export const bootstrap = stampit()
  .init(function() {
    let type = 'number';

    this.create = function create($element) {
      const $formGroup = $element ? updateInput($element, this) : createInput(Object.assign({}, this, { type }));
      $formGroup.$input.setAttribute('max', this.max);
      $formGroup.$input.setAttribute('min', this.min);
      return $formGroup.$element;
    };
  })
  .compose(defaults, metadata);
