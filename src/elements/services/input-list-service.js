import { DOM } from 'aurelia-pal';
import { deepClone, deleteTarget } from '../../elements/services/dom-service';

/**
 * @implements {IFormService}
 */
export class InputListService {

  /**
   * @summary dynamically populate the form with an input drawer list
   * @desc find all input list custom attributes and all elements with the same
   * name and make sure the element with the inpul-list attribute gets cloned
   * and value populated for every value in the data object
   * @param {FormHtmlElement} $form the form to search through
   * @param {Object} data the key value object that persists the form data
   */
  populate($form, data) {
    // data can have no data
    if (!data) return;

    const $inputs = $form.querySelectorAll('[input-list]');

    for (let i = 0; i < $inputs.length; i++) {
      const $elem = $inputs[i];
      const $list = $form.querySelectorAll(`[name=${$elem.name}]`);
      const values = data[$elem.name] || [];
      const $fragment = DOM.createDocumentFragment();

      for(let v = 1; v < Math.max($list.length, values.length); v++) {
        if ($list[v]) {
          $list[v].value = values[v];
        } else {
          const $clone = this.cloneSelf($elem);
          $fragment.appendChild($clone);
          $clone.value = values[v];
        }
      }

      if ($fragment.hasChildNodes()) this.appendNext($elem, $fragment);
    }
  }

  collect() {
    // do nothing, but implement the interface
  }

  cloneSelf($target) {
    const $clone = deepClone($target);
    $clone.removeAttribute('input-list');
    $clone.onkeydown = deleteTarget;
    return $clone;
  }

  appendNext($target, $clone) {
    $target.nextSibling.appendChild($clone);
  }
}
