import stampit from  'stampit';
import { createInput, updateInput } from './bootstrap/input';
import map from './viewMap';

const defaults = stampit()
  .props({
    text: '',
    multiple: false
  });

const metadata = stampit()
  .props({
    schema: [ map.text, map.attachment ]
  });

export const bootstrap = stampit()
  .init(function() {
    let type = 'file'

    this.create = function create($element) {
      const $formGroup = $element ? updateInput($element, this) : createInput(Object.assign({}, this, { type }));

      if (this.multiple) {
        $formGroup.$input.setAttribute('multiple', '');
      } else {
        $formGroup.$input.removeAttribute('multiple');
      }

      // when designing for the element we don't want the file dialog to pop up
      $formGroup.$input.onclick = e => e.preventDefault();

      return $formGroup.$element;
    }
  })
  .compose(defaults, metadata);
