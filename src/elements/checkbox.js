import stampit from  'stampit';
import { createOptions, updateOptions } from './bootstrap/input';
import map from './viewMap';

const defaults = stampit()
  .props({
    required: false,
    text: '',
    options: ''
  });

const metadata = stampit()
  .props({
    schema: [ map.text, map.input, map.options ]
  });

export const bootstrap = stampit()
  .init(function() {
    let type = 'checkbox';

    this.create = function create($element) {
      return $element ? updateOptions($element, this) : createOptions(Object.assign({}, this, { type }));
    }
  })
  .compose(defaults, metadata);
