import * as duplicator from '../../../src/elements/duplicator';

describe('the duplicator element', () => {

  it('has bootstrap properties', () => {
    const sut = duplicator.bootstrap();

    expect(sut.multiple).toBeFalsy();
    expect(sut.schema).toBeDefined();
    expect(sut.schema).toContain('attachment.html');
  });

  it('does not create a button when no element', () => {
    const sut = duplicator.bootstrap();
    sut.multiple = true;

    const $elem = sut.duplicate();

    expect($elem).toEqual(undefined)
  });

  it('does not create a button when multiple is false', () => {
    const $elem = document.createElement('div');
    const sut = duplicator.bootstrap();
    sut.multiple = false;

    const $elemWithAddOn = sut.duplicate($elem);

    expect($elem.querySelector('button')).toEqual(null);
    expect($elemWithAddOn).toBe($elem);
  });
});
