import stampit from  'stampit';
import { createInput, updateInput } from './bootstrap/input';
import map from './viewMap';

const defaults = stampit()
  .props({
    name: '',
    required: false,
    text: '',
    min: null,
    max: null
  });

const metadata = stampit()
  .props({
    schema: [ map.text, map.name, map.input, map.range ]
  });

export const bootstrap = stampit()
  .init(function() {
    let type = 'date';
    this.min = formatDate(new Date());

    this.create = function create($element) {
      const formGroup = $element ?
        updateInput($element, Object.assign({}, this, { type })) :
        createInput(Object.assign({}, this, { type }));

      formGroup.$input.setAttribute('max', this.max);
      formGroup.$input.setAttribute('min', this.min);
      return formGroup.$element;
    };
  })
  .compose(defaults, metadata);

function formatDate(date) {
  let monthPadded = '0' + date.getMonth();
  let dayPadded = '0' + date.getDate();
  let year = date.getFullYear();

  return `${year}-${monthPadded.substr(monthPadded.length - 2)}-${dayPadded.substr(dayPadded.length - 2)}`;
}
