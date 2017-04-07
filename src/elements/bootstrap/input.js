import { DOM } from 'aurelia-pal';

export function createInput(options) {
  const $formgroup = DOM.createElement('div');
  const $inputLabel = DOM.createElement('label');
  const $input = DOM.createElement('input');

  $formgroup.className = 'form-group';
  $inputLabel.textContent = options.text;
  $input.type = options.type;
  $input.name = options.name;
  $input.required = options.required;
  $input.className = 'form-control';

  $formgroup.appendChild($inputLabel);
  $formgroup.appendChild($input);

  return { $element: $formgroup, $input, $inputLabel };
}

export function updateInput($element, options) {
  const $inputLabel = $element.querySelector('label');
  const $input = $element.querySelector('input');

  $inputLabel.textContent = options.text;
  $input.required = options.required;

  return { $element, $input, $inputLabel };
}

export function createOptions(options) {
  const $wrapper = DOM.createElement('div');
  $wrapper.style.border = '1px solid rgb(222, 226, 227)';

  updateOptions($wrapper, options);

  return $wrapper;
}

export function updateOptions($element, options) {
  const $boxes = $element.querySelectorAll(options.type);
  const boxes = options.options.split(',');
  // replace so i don't blow away the <br />
  $element.innerText = `${options.text}\n`;

  for (let i = boxes.length; i < $boxes.length; i++) {
    $boxes[0].parentNode.removeChild($boxes[i]);
  }

  for (let i = 0; i < boxes.length; i++) {
    const name = options.name || boxes[i].replace(/ /g, '');
    const optionObj = _createOption(Object.assign({}, options, { name }));

    optionObj.$input.value = boxes[i];

    if ($boxes[i]) {
      $boxes[i].replaceWith(optionObj.$label);
      $boxes[i].parentNode.replaceChild(optionObj.$label, $boxes[i]);
    } else {
      $element.appendChild(optionObj.$label);
    }

    // the required element does not make sense on all of them just if there is
    // one
    if (boxes.length === 1) {
      optionObj.$input.required = options.required;
    }

    // IMPORTANT: keep this at the end of the loop because it has to be set when
    // all input attributes are done being set
    optionObj.$label.innerHTML = optionObj.$input.outerHTML + boxes[i];
  }

  return $element;
}

// to prevent inifinit loop
function _createOption(options) {
  const $label = DOM.createElement('label');
  const $input = DOM.createElement('input');

  $input.name = options.name;
  $input.type = options.type;
  $label.className = `${options.type}-inline`;

  return { $label, $input };
}
