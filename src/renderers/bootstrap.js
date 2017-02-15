import { DOM } from 'aurelia-pal';
import { hasDuplicates } from '../utils';

export function date(options) {
  const datepicker = DOM.createElement('div');
  const input = DOM.createElement('input');
  const addon = DOM.createElement('div');
  const span = DOM.createElement('span');

  datepicker.className = 'input-group date';
  datepicker.setAttribute('data-provide', 'datepicker');
  input.type = 'text';
  input.className = 'form-control datepicker';
  input.setAttribute('data-date-format', options.format);
  addon.className = 'input-group-addon';
  span.className = 'glyphicon glyphicon-th';

  datepicker.appendChild(input);
  datepicker.appendChild(addon);
  addon.appendChild(span);

  return datepicker;
}

export function number(options) {
  options.type = 'number';
  return _createInput(options);
}

export function checkbox(options) {
  options.type = 'checkbox';
  return _createOption(options);
}

export function radio(options) {
  options.type = 'radio';
  return _createOption(options);
}

export function label(options) {
  const span = DOM.createElement('span');

  span.className = `label label-${options.type}`;
  span.textContent = options.name;

  return span;
}

export function select(options) {
  const formgroup = DOM.createElement('div');
  const label = DOM.createElement('label');
  const select = DOM.createElement('select');

  formgroup.className = 'form-group'
  label.textContent = options.name
  label.htmlfor = select.id = options.id;
  select.className = 'form-control';

  select.options[0] = new Option('Select a value', '');

  for (let i = 0; i < options.options.length; i++) {
    const kvp = options.options[i];
    // +1 because of the default above
    select.options[i + 1] = new Option(kvp.text, kvp.value);
  }

  formgroup.appendChild(label);
  formgroup.appendChild(select);

  return formgroup;
}

export function text(options) {
  const formgroup = DOM.createElement('div');
  const label = DOM.createElement('label');
  const text = DOM.createElement('textarea');

  formgroup.className = "form-group"
  label.textContent = options.name;
  label.htmlfor = text.id = options.id;
  text.className = 'form-control';
  text.rows = options.rows;

  formgroup.appendChild(label);
  formgroup.appendChild(text);

  return formgroup;
}

export function link(options) {
  const link = DOM.createElement('a');
  link.href = options.href;
  link.textContent = options.name;
  link.onclick = e => e.preventDefault();
  return link;
}

export function iframe(options) {
  const iframe = DOM.createElement('iframe');
  iframe.src = options.href;
  iframe.width = options.width;
  iframe.height = options.height;
  return iframe;
}

export function header(options) {
  const header = DOM.createElement(`h${options.size}`);
  header.textContent = options.name;
  return header;
}

export function attachments(options) {
  options.type = 'file';
  const files = _createInput(options)
  files.setAttribute('multiple', true);
  return files;
}

/**
 * @desc Creates on tab nav and tab content. Pass in an existing tab-nav id to
 * append to tab to an existing group
 * @param {Options} options the tab options
 */
export function tab(options) {
  const wrapper = _createTabGroup(options.name, options.type);
  const list = wrapper.children[0];
  const contentWrapper = wrapper.children[1];
  const headers = options.headers.split(',');

  if (hasDuplicates(headers.map(h => h.trim()))) {
    throw new Error(`Cannot have duplicate headers`);
  }

  for (var i = 0; i < headers.length; i++) {
    const header = headers[i];
    const hrefId = (options.name + header).replace(/ /g, '');
    const item = DOM.createElement('li');
    const a = DOM.createElement('a');
    const content = DOM.createElement('div');
    a.setAttribute('data-toggle', options.type);
    a.href = `#${hrefId}`;
    a.textContent = header;
    content.id = hrefId;

    if (i === 0) {
      content.className = 'tab-pane fade in active';
      item.className = 'active';
    }

    item.appendChild(a);
    list.appendChild(item);
    contentWrapper.appendChild(content);

    a.onclick = function(e) {
      _deactivateAllTabs(contentWrapper.children);
      _deactivateAllTabs(list.children);
      item.classList.add('active');
      content.classList.add('in');
      content.classList.add('active');
    };
  }

  return wrapper;
}

function _createTabGroup(groupId, tabType) {
  const wrapper = DOM.createElement('div');
  const list = DOM.createElement('ul');
  const contentWrapper = DOM.createElement('div');

  wrapper.id = groupId;
  list.className = `nav nav-${tabType}s`;
  contentWrapper.className = 'tab-content';
  wrapper.appendChild(list);
  wrapper.appendChild(contentWrapper);

  return wrapper;
}

function _deactivateAllTabs(tabs) {
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove('active');
    tabs[i].classList.remove('in');
  }
}

export function _createOption(options) {
  const label = DOM.createElement('label');
  const input = DOM.createElement('input');

  input.type = options.type;
  input.name = options.name;
  label.innerHTML = input.outerHTML + options.name
  label.className = `${options.type}-inline`;

  return label;
}

export function _createInput(options) {
  const formgroup = DOM.createElement('div');
  const label = DOM.createElement('label');
  const input = DOM.createElement('input');

  formgroup.className = 'form-group';
  label.textContent = options.name;
  label.htmlfor = input.id = options.id;
  input.type = options.type;
  input.className = 'form-control';

  formgroup.appendChild(label);
  formgroup.appendChild(input);

  return formgroup;
}
