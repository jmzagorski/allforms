import * as header from '../../../src/elements/header';

describe('the header element', () => {

  it('has standard header properties', () => {
    const sut = header.standard();

    expect(sut.size).toEqual(1);
    expect(sut.text).toBeDefined();
    expect(sut.schema).toBeDefined();
    expect(sut.schema).toContain('text.html');
    expect(sut.schema).toContain('header.html');
  });

  it('creates a standard header', () => {
    const sut = header.standard();
    sut.text = 'a';
    sut.size = 4

    const $header = sut.create();

    expect($header.tagName).toEqual('H4');
    expect($header.textContent).toEqual('a');
  });
});
