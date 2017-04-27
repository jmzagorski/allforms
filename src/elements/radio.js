import stampit from  'stampit';
import { createOptions, updateOptions } from './bootstrap/input';
import map from './viewMap';

const defaults = stampit()
  .props({
    required: false,
    text: '',
    name: '',
    options: ''
  });

const metadata = stampit()
  .props({
    schema: [ map.text, map.name, map.input, map.options ]
  });

export const bootstrap = stampit()
  .init(function() {
    let type = 'radio';

    this.create = function create($element) {
      return $element ?
        updateOptions($element, Object.assign({}, this, { type })) :
        createOptions(Object.assign({}, this, { type }));
    };
  })
  .compose(defaults, metadata);
