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
    schema: [ map.text, map.name, map.input, map.range ]
  });

export const bootstrap = stampit()
  .init(function() {
    let type = 'text';

    this.create = function create($element) {
      const $formGroup = $element ? updateInput($element, this) : createInput(Object.assign({}, this, { type }));
      $formGroup.$input.setAttribute('pattern', `.{${this.min},${this.max || ''}}`);
      $formGroup.$input.title = `${this.min} to ${this.max || 'infinite'} characters`;
      return $formGroup.$element;
    };
  })
  .compose(defaults, metadata);
