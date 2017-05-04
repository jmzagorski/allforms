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

  it('replaces the original header with a different size', () => {
    const sut = header.standard();
    sut.text = 'a';
    sut.size = 4
    const $header = sut.create();
    sut.size = 6
    // need a parent node, which typically would be another elem or body
    const $parent = document.createElement('div');
    $parent.appendChild($header);

    const $newHeader = sut.create($header);

    expect($newHeader.tagName).toEqual('H6');
    expect($newHeader.textContent).toEqual('a');
    expect($newHeader).not.toBe($header);
  });

  it('replaces only the text when the size is the same', () => {
    const sut = header.standard();
    sut.text = 'a';
    sut.size = 4
    const $header = sut.create();

    const $newHeader = sut.create($header);

    expect($newHeader).toBe($header);
  });
});
