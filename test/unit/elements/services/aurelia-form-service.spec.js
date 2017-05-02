import { AureliaFormService } from '../../../../src/elements/services/aurelia-form-service';

describe('the aurelia form service', () => {
  let sut;

  beforeEach(() => {
    sut = new AureliaFormService();
  });

  it('removes all the au-target attributes', () => {
    const attr = 'au-target';
    const $form = document.createElement('form');
    const $input = document.createElement('input');
    $input.setAttribute(attr, 1);
    const $span = document.createElement('span');
    $span.setAttribute(attr, 1);
    $form.appendChild($input);
    $form.appendChild($span);

    sut.populate($form);

    expect($input.getAttribute(attr)).toEqual(null);
    expect($span.getAttribute(attr)).toEqual(null);
  });
})
