import Promise from 'bluebird';

export function buildLocationLinks(location, start) {
  start = start || 0;
  location = location || window.location;
  // to prevent the root pathname from splitting twice
  const fixPath = location.pathname === '/' ? '' : location.pathname;
  const segments = [];

  const segs =  (fixPath || location.hash).split('/') || [];

  for (let i = start; i < segs.length; i++) {
    segments.push({
      url: encodeURI(segs.filter((item, idx) => idx <= i).map(i => i.replace(' ', '-')).join('/')),
      display: segs[i]
    });
  }

  return segments;
}

export function importFetch() {
  return !self.fetch ? System.import('isomorphic-fetch') :
    Promise.resolve(self.fetch);
}

export function hasDuplicates(array) {
  for (let i = 0; i < array.length; i++) {

    if (array.indexOf(array[i]) !== i) return true;
  }

  return false;
}

export function randomId() {
  return Math.floor((Math.random() * 1000) + 1);
}

/**
 * @desc sets the value of an element, be it the value attribute or innerhtml
 * @param {Element} el the element
 */
// TODO make value renderers
// make dom renderers
export function setDefaultVal(el) {
  const canCheck = el.type === 'checkbox' || el.type === 'radio';
  const canSelect = el.type === 'select-one';
  el.defaultValue = el.value;

  if (canCheck) {
    if (el.checked) {
      el.setAttribute('checked', el.checked);
    } else {
      el.removeAttribute('checked');
    }
  }

  if (canSelect) {
    for (let i = 0; i < el.options.length; i++) {
      el.options[i].removeAttribute('selected');
    }
    el.options[el.options.selectedIndex].setAttribute('selected', true);
  }
}

export function parseCsv(text, lineTerminator, cellTerminator) {
  const lines = text.split(lineTerminator);
  const data = [];

  for (let line of lines) {
    const values = [];

    if (line !== "") {

      const cells = line.split(cellTerminator);

      for (let cell of cells) values.push(cell);
    }

    data.push(values);
  }

  return data;

}

export function getEndingCharPos(str, start, char) {
  let braces = 0;
  let index = start;

  for (let i = start; i <= str.length; ++i) {
    switch (str[i]) {
      case '(':
        ++braces;
        break;
      case ')':
        --braces;
        break;
    }

    if (braces === 0) break;
    index++;
  }

  return index === -1 ? str.length : index;
}

export function getIndicesOf(searchStr, str) {
  const searchStrLen = searchStr.length;

  if (searchStrLen == 0) return [];

  const indices = [];
  let startIndex = 0;
  let index = 0;

  while ((index = str.indexOf(searchStr, startIndex)) > -1) {
    indices.push(index);
    startIndex = index + searchStrLen;
  }

  return indices;
}

export function isObject(val) {
  return Object.prototype.toString.call(val) === '[object Object]';
}

export function replaceBetween(str, start, end, replace) {
  return str.substring(0, start) + replace + str.substring(end);
}
