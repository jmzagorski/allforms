import { AureliaFormService } from '../../../../src/elements/services/aurelia-form-service';

describe('the aurelia form service', () => {
  let sut;

  beforeEach(() => {
    sut = new AureliaFormService();
  });

  it('removes the au-target attribute', () => {
    const attr = 'au-target-id';
    const $input = document.createElement('input');
    const $span = document.createElement('span');
    $input.setAttribute(attr, 1);
    $span.setAttribute(attr, 1);

    $span.appendChild($input);

    sut.clean($span);

    expect($input.getAttribute(attr)).toEqual(null);
    expect($span.getAttribute(attr)).toEqual(null);
  });

  xit('removes the au-target class', () => {
    const attr = 'au-target-id';
    const $input = document.createElement('input');
    const $span = document.createElement('span');
    $input.className = attr + ' something';
    $span.className = attr + ' something';

    $span.appendChild($input);

    sut.clean($span);

    expect($input.className).toEqual('something');
    expect($span.className).toEqual('something');
  });
})
