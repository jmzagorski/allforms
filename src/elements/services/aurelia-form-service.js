/**
 * @implements {IFormService}
 */
export class AureliaFormService {

  populate($form, data) {
    const $elems = $form.querySelectorAll('[au-target]');

    for (let i = 0; i < $elems.length; i++) {
      const $elem = $elems[i];
      $elem.removeAttribute('au-target');
    }
  }

  collect() {
    // do nothing, but implement the interface
  }
}
