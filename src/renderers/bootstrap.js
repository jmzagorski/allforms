import { DOM } from 'aurelia-pal';
import { hasDuplicates, parseCsv, randomId } from '../utils';

// TODO generate random name
// TODO a lot of this is not bootstrap specific, abstract away from this module
//export function create(type, options) {
  //const elems = [];
  //const name = _genRandomId();
  
  //for (let i = 0; i < options.qty; i++) {
    //const elem = window[type](options);

    //// set the same name so elements like radios are grouped togther
    //elem.name = name;

    //if (options.required) elem.required = true;

    //elems.push(elem);
  //}

  //return elems;
//}

export function alert(options) {
  const div = DOM.createElement('div');
  div.className = `alert alert-${options.type}`;
  div.innerHTML = options.text;
  return div;
}

export function attachments(options) {
  options.type = 'file';
  const files = _createInput(options)
  files.setAttribute('multiple', true);
  return files;
}

export function checkbox(options) {
  options.type = 'checkbox';
  return _createOption(options);
}

export function date(options) {
  options.type = 'date';
  const elem = _createInput(options);
  const input = elem.querySelector('input');
  input.setAttribute('max', options.max);
  input.setAttribute('min', options.min);

  return elem;
}

export function header(options) {
  const header = DOM.createElement(`h${options.size}`);
  header.textContent = options.text;
  return header;
}

export function iframe(options) {
  const iframe = DOM.createElement('iframe');
  iframe.src = options.href;
  iframe.width = options.width;
  iframe.height = options.height;
  return iframe;
}

export function label(options) {
  const span = DOM.createElement('span');

  span.className = `label label-${options.type}`;
  span.textContent = options.text;

  return span;
}

export function link(options) {
  const link = DOM.createElement('a');
  link.href = options.href;
  link.textContent = options.text;
  link.onclick = e => e.preventDefault();
  return link;
}

export function number(options) {
  options.type = 'number';
  const elem = _createInput(options);
  const input = elem.querySelector('input');
  input.setAttribute('max', options.max);
  input.setAttribute('min', options.min);

  return elem;
}

export function radio(options) {
  options.type = 'radio';
  return _createOption(options);
}

export function select(options) {
  const formgroup = DOM.createElement('div');
  const label = DOM.createElement('label');
  const select = DOM.createElement('select');

  formgroup.className = 'form-group'
  label.textContent = options.label;
  label.htmlfor = select.id = options.id;
  select.className = 'form-control';

  const fr = new FileReader();
  fr.readAsText(options.optionSrc[0]);
  fr.onload = () => {
    const data = parseCsv(fr.result, '\n', ',');
    for (let i = 0; i < data.length; i++) {
      // +1 because of the default above
      select.options[i] = new Option(data[i][1], data[i][0]);
    }
  };

  formgroup.appendChild(label);
  formgroup.appendChild(select);

  return formgroup;
}

export function text(options) {
  options.type = 'text';
  const elem = _createInput(options);
  const input = elem.querySelector('input');
  input.setAttribute('pattern', `.{${options.min}, ${options.max}}`);

  return elem;
}

export function tab(options) {
  const wrapper = _createTabGroup(options.id, options.type);
  const list = wrapper.children[0];
  const contentWrapper = wrapper.children[1];
  const headers = options.headers.split(',');

  if (hasDuplicates(headers.map(h => h.trim()))) {
    throw new Error(`Cannot have duplicate headers`);
  }

  for (var i = 0; i < headers.length; i++) {
    const header = headers[i];
    const hrefId = (options.id + header).replace(/ /g, '');
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

// PRIVATE HELPER FUNCTIONS

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
  label.innerHTML = input.outerHTML + options.label
  label.className = `${options.type}-inline`;

  return label;
}

export function _createInput(options) {
  const formgroup = DOM.createElement('div');
  const label = DOM.createElement('label');
  const input = DOM.createElement('input');

  formgroup.className = 'form-group';
  label.textContent = options.label;
  label.htmlfor = input.id = options.id;
  input.type = options.type;
  input.className = 'form-control';

  formgroup.appendChild(label);
  formgroup.appendChild(input);

  return formgroup;
}

function _genRandomId() {
  let id;
  do {
    id = randomId();
  } 
  while(DOM.getElementsByName(id));

  return id;
}
