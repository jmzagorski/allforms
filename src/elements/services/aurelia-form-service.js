export class AureliaFormService {

  /**
   * @summary cleans off the aurelia enhancement data on an element
   * @param {Element} $elem the parent element to search
   *
   */
  clean($elem) {
    const $targets = $elem.querySelectorAll('[au-target-id]');

    this._cleanSingle($elem);

    for (let i = 0; i < $targets.length; i++) {
      const $enhanced = $targets[i];
      this._cleanSingle($enhanced)
    }
  }

  _cleanSingle($elem) {
    $elem.removeAttribute('au-target-id');
    $elem.classList.remove('au-target');
  }
}
