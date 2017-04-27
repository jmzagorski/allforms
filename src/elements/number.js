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
    let type = 'number';
    this.schema = this.schema || [];
    this.schema = this.schema.concat([ map.text, map.name, map.range, map.input] )

    this.create = function create($element) {
      const formGroup = $element ?
        updateInput($element, Object.assign({}, this, { type })) :
        createInput(Object.assign({}, this, { type }));

      formGroup.$input.setAttribute('max', this.max);
      formGroup.$input.setAttribute('min', this.min);

      if (!$element) this.duplicate(formGroup.$input);

      return formGroup.$element;
    };
  })
  .compose(defaults, duplicator);
