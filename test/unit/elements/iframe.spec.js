import * as iframe from '../../../src/elements/iframe';

describe('the iframe element', () => {

  it('has standard iframe properties', () => {
    const sut = iframe.standard();

    expect(sut.href).toEqual('#/');
    expect(sut.width).toEqual(700);
    expect(sut.height).toEqual(300);
    expect(sut.schema).toBeDefined();
    expect(sut.schema).toContain('href.html');
    expect(sut.schema).toContain('iframe.html');
  });

  it('creates a standard iframe', () => {
    const sut = iframe.standard();
    sut.href = 'hahababa';
    sut.width = 100;
    sut.height = 200;

    const $element = sut.create();

    expect($element.tagName).toEqual('IFRAME');
    expect($element.src).toContain('/hahababa');
    expect($element.height).toEqual('200');
    expect($element.width).toEqual('100');
  });

  it('updates the iframe', () => {
    const sut = iframe.standard();
    const $existing = document.createElement('iframe');
    sut.href = 'hahababa';
    sut.width = 100;
    sut.height = 200;

    const $updated = sut.create($existing);

    expect($updated).toBe($existing);
    expect($updated.src).toContain('/hahababa');
    expect($updated.height).toEqual('200');
    expect($updated.width).toEqual('100');
  });
});
