import stampit from  'stampit';
import { createInput, updateInput } from './bootstrap/input';
import map from './viewMap';
import { bootstrap as duplicator } from './duplicator';

const defaults = stampit()
  .props({
    name: '',
    required: false,
    text: '',
    min: 0,
    max: null
  });

export const bootstrap = stampit()
  .init(function() {
    let type = 'text';
    this.schema = this.schema || [];
    this.schema = this.schema.concat([ map.text, map.name, map.input, map.range ]);

    this.create = function create($element) {
      const formGroup = $element ?
        updateInput($element, Object.assign({}, this, { type })) :
        createInput(Object.assign({}, this, { type }));

      formGroup.$input.setAttribute('pattern', `.{${this.min},${this.max || ''}}`);
      formGroup.$input.title = `${this.min} to ${this.max || 'infinite'} characters`;

      if (!$element) this.duplicate(formGroup.$input);

      return formGroup.$element;
    };
  })
  .compose(defaults, duplicator);
