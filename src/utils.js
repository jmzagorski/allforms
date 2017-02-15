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
  el.defaultValue = el.value;

  if (canCheck) {
    if (el.checked) {
      el.setAttribute('checked', el.checked);
    } else {
      el.removeAttribute('checked');
    }
  }
}
