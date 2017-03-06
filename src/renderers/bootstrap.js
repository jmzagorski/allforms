import { DOM } from 'aurelia-pal';
import { hasDuplicates, parseCsv } from '../utils';

// TODO - but don't override class name

export const alert = {
  create: options => {
    const $alert = DOM.createElement('div');
    alert.update(options, $alert);
    return $alert;
  },
  update: (options, $element) => {
    // replace it with an empty string and then add it so i dont need logic if
    // it is there or not
    const className = $element.className.replace(/\balert\b\s\balert-[a-z]+\b(\s|$)/, '');
    $element.className = `${className} alert alert-${options.type}`.trim();
    $element.textContent = options.text;
    return $element;
  }
}

export const attachments = {
  create: options => {
    options.type = 'file';
    const $attachments = _createInput(options)
    $attachments.setAttribute('multiple', true);
    return $attachments;
  }, 
  update: (options, $element) => {
    _updateInput($element, options);
    return $element;
  }
}

export const checkbox = {
  create: options => {
    options.type = 'checkbox';
    return _createOption(options);
  },
  update: (options, $element) => {
    _updateOption($element, options);
    return $element;
  }
}

export const date = {
  create: options => {
    options.type = 'date';
    const $date = _createInput(options);
    date.update(options, $date);
    return $date;
  },
  update: (options, $element) => {
    _updateInput($element, options, input => {
      input.setAttribute('max', options.max);
      input.setAttribute('min', options.min);
    });

    return $element;
  }
}

export const header = {
  create: options => {
    const tag = header.getTag(options);
    const $header = DOM.createElement(tag);
    header.update(options, $header);
    return $header;
  },
  update: (options, $element) => {
    if (options.size && $element.tagName !== header.getTag(options)) {
      const updated = header.create(options);
      updated.textContent = options.text;
      return updated;
    } else {
      $element.textContent = options.text;
    }

    return $element;
  },
  getTag: options => `H${options.size}`
}

export const iframe = {
  create: options => {
    const $iframe = DOM.createElement('iframe');
    iframe.update(options, $iframe);
    return $iframe;
  },
  update: (options, $element) => {
    $element.src = options.href;
    $element.width = options.width;
    $element.height = options.height;
    return $element;
  }
}

export const label = {
  create: options => {
    const $label = DOM.createElement('span');
    label.update(options, $label);
    return $label;
  },
  update: (options, $element) => {
    const className = $element.className.replace(/\blabel\b\s\blabel-[a-z]+\b(\s|$)/, '');
    $element.className = `${className} label label-${options.type}`.trim();
    $element.textContent = options.text;
    return $element;
  }
}

export const link = {
  create: options => {
    const $link = DOM.createElement('a');
    $link.onclick = e => e.preventDefault();
    link.update(options, $link);
    return $link;
  },
  update: (options, $element) => {
    $element.href = options.href;
    $element.textContent = options.text;
    return $element;
  }
}

export const number = {
  create: options => {
    options.type = 'number';
    const $number = _createInput(options);
    number.update(options, $number);
    return $number;
  },
  update: (options, $element) => {
    _updateInput($element, options, $input => {
      $input.setAttribute('max', options.max);
      $input.setAttribute('min', options.min);
    });
    return $element;
  }
}

export const radio = {
  create: options => {
    options.type = 'radio';
    return _createOption(options);
  },
  update: (options, $element) => {
    _updateOption($element, options);
    return $element;
  }
}

export const select = {
  create: options => {
    const $formGroup = DOM.createElement('div');
    const $label = DOM.createElement('label');
    const $select = DOM.createElement('select');
    $formGroup.className = 'form-group'
    $label.htmlfor = $select.id = options.id;
    $select.className = 'form-control';
    $formGroup.appendChild($label);
    $formGroup.appendChild($select);

    select.update(options, $formGroup);

    return $formGroup;
  },
  update: (options, $element) => {
    const $label = $element.querySelector('label');
    const $select = $element.querySelector('select');

    $label.textContent = options.text;

    if (options.optionSrc) {
      const fr = new FileReader();
      fr.readAsText(options.optionSrc[0]);
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
}

export const text = {
  create: options => {
    options.type = 'text';
    const $text = _createInput(options);
    text.update(options, $text);
    return $text;
  },
  update: (options, $element) => {
    _updateInput($element, options, $input => {
      $input.setAttribute('pattern', `.{${options.min}, ${options.max}}`);
    });
    return $element;
  }
}

export const tab = {
  create: options => {
    const headers = options.headers.split(',');

    if (hasDuplicates(headers.map(h => h.trim()))) {
      throw new Error(`Cannot have duplicate headers`);
    }

    const wrapper = _createTabGroup(options.id, options.type);
    const list = wrapper.children[0];
    const contentWrapper = wrapper.children[1];

    for (var i = 0; i < headers.length; i++) {
      const header = _createHeader(headers[i], options, list, contentWrapper);

      if (i === 0) {
        header.content.classList.add('active');
        header.item.classList.add('active');
      }
    }

    return wrapper;
  },
  update: (options, $element) => {
    const optHeaders = options.headers.split(',');

    if (hasDuplicates(optHeaders.map(h => h.trim()))) {
      throw new Error(`Cannot have duplicate headers`);
    }

    _updateTabGroup($element, options.type);

    const domHeaders = $element.querySelectorAll('li');
    const list = $element.children[0];
    const contentWrapper = $element.children[1];

    // remove headers that no longer exist in the options
    for (let i = optHeaders.length; i < domHeaders.length; i++) {
      domHeaders[0].parentNode.removeChild(domHeaders[i]);
    }

    for (let i = 0; i < optHeaders.length; i++) {
      const $header = domHeaders[i];
      const optHeader = optHeaders[i];

      if ($header) {
        const hrefId = (options.id + optHeader).replace(/ /g, '');
        const a = $header.querySelector('a');
        // assuming the id does not change
        const oldHrefId = `#${options.id + a.textContent.trim()}`;
        const content = $header.parentNode.parentNode.querySelector(oldHrefId);
        a.setAttribute('data-toggle', options.type);
        a.href = `#${hrefId}`;
        a.textContent = optHeader;
        content.id = hrefId;
      } else {
        _createHeader(optHeader, options, list, contentWrapper);
      }
    }

    return $element;
  }
}

// PRIVATE HELPER FUNCTIONS

function _createTabGroup(groupId, tabType) {
  const wrapper = DOM.createElement('div');
  const list = DOM.createElement('ul');
  const contentWrapper = DOM.createElement('div');

  wrapper.style.height = '100%';
  wrapper.style.width = '100%';
  contentWrapper.style.height = '100%';
  contentWrapper.style.width = '100%';
  contentWrapper.style.border = '1px solid rgb(222, 226, 227)';
  wrapper.id = groupId;
  list.className = `nav nav-${tabType}s`;
  contentWrapper.className = 'tab-content';
  wrapper.appendChild(list);
  wrapper.appendChild(contentWrapper);

  return wrapper;
}

function _updateTabGroup($element, tabType) {
  const list = $element.querySelector('ul');
  list.className = `nav nav-${tabType}s`;
}

function _deactivateAllTabs(tabs) {
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove('active');
    tabs[i].classList.remove('in');
  }
}

function _createHeader(header, options, list, contentWrapper) {
  const hrefId = (options.id + header).replace(/ /g, '');
  const item = DOM.createElement('li');
  const a = DOM.createElement('a');
  const content = DOM.createElement('div');
  content.setAttribute('dropzone','');
  a.setAttribute('data-toggle', options.type);
  a.href = `#${hrefId}`;
  a.textContent = header;
  content.id = hrefId;
  content.className = 'tab-pane';

  item.appendChild(a);
  list.appendChild(item);
  contentWrapper.appendChild(content);

  return { item, a, content };
}

function _createOption(options) {
  const label = DOM.createElement('label');
  const input = DOM.createElement('input');

  input.type = options.type;
  label.innerHTML = input.outerHTML + options.text
  label.className = `${options.type}-inline`;

  return label;
}

function _updateOption($element, options) {
  $element.textContent = options.text;
}

function _createInput(options) {
  const formgroup = DOM.createElement('div');
  const label = DOM.createElement('label');
  const input = DOM.createElement('input');

  formgroup.className = 'form-group';
  label.textContent = options.text;
  label.htmlfor = input.id = options.id;
  input.type = options.type;
  input.className = 'form-control';

  formgroup.appendChild(label);
  formgroup.appendChild(input);

  return formgroup;
}

function _updateInput($element, options, inputSetupCb) {
  const label = $element.querySelector('label');

  label.textContent = options.text;

  if (inputSetupCb) {
    const input = $element.querySelector('input');
    inputSetupCb(input);
  }
}
