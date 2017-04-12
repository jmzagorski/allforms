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
      url: encodeURI(segs.filter((item, idx) => idx <= i).map(s => s.replace(' ', '-')).join('/')),
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

export function parseCsv(text, lineTerminator, cellTerminator) {
  const lines = text.split(lineTerminator);
  const data = [];

  for (let line of lines) {
    const values = [];

    if (line !== '') {
      const cells = line.split(cellTerminator);

      for (let cell of cells) values.push(cell);
    }

    data.push(values);
  }

  return data;
}

export function getEndingCharPos(str, start, char) {
  const charStart = str.indexOf(char, start);
  let braces = 0;
  let index = charStart;

  for (let i = charStart; i <= str.length; ++i) {
    switch (str[i]) {
      case '(':
        ++braces;
        break;
      case ')':
        --braces;
        break;
      default:
        break;
    }

    if (braces === 0) break;
    index++;
  }

  return index === -1 ? str.length : index;
}

export function getIndicesOf(searchStr, str) {
  const searchStrLen = searchStr.length;

  if (searchStrLen === 0) return [];

  const indices = [];
  const regex = new RegExp(`\\b${searchStr}\\b`, 'g');
  let match = null;

  while ((match = regex.exec(str))) { // eslint-disable-line no-cond-assign
    indices.push(match.index);
  }

  return indices;
}

export function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

export function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

export function getPrototypeString(obj) {
  return Object.prototype.toString.call(obj);
}

export function getFunctionBody(func) {
  const funcAsString = func.toString();
  return funcAsString
    .substring(funcAsString.indexOf('{') + 1, funcAsString.lastIndexOf('}'));
}
