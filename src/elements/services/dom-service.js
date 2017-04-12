/**
 * @summary delete with the delete key
 * @param {Object} event the event object
 * @return {Boolean} true if deleted else undefined. Returning false can have
 * side affects in javascript like preventing the default action from happening.
 */
export function deleteTarget(event) {
  if (event.keyCode === 46) {
    const confirmDelete = confirm('Are you sure you want to delete this element?');

    if(confirmDelete) {
      const t = event.target.parentNode.removeChild(event.target);
      return true
    }
  }
}

export function deepClone(event, $target) {
  const $cloning = $target || event.target;
  const $deepClone = $cloning.cloneNode(true);
  const $newElements = [$deepClone].concat(...$deepClone.children);

  for (let i = 0; i < $newElements.length; i++) {
    $newElements[i].id = '';
  }

  return $deepClone;
}

/**
 * @summary sets the default value of an element
 * @param {Element} el the element to set
 */
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
