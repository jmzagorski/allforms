import * as link from '../../../src/elements/link';

describe('the link element entity', () => {

  it('has standard link properties', () => {
    const sut = link.standard();

    expect(sut.text).toBeDefined();
    expect(sut.href).toEqual('#/');
    expect(sut.schema).toBeDefined();
    expect(sut.schema).toContain('href.html');
    expect(sut.schema).toContain('text.html');
  });

  it('creates a standard link element', () => {
    const sut = link.standard();
    sut.href = '/hahababa';
    sut.text = 'a';

    const $elem = sut.create();

    expect($elem.tagName).toEqual('A');
    expect($elem.href).toContain('/hahababa');
    expect($elem.textContent).toContain('a');
  });

  it('updates a standard link', () => {
    const sut = link.standard();
    const $existing = document.createElement('a');
    sut.href = 'hahababa';
    sut.text = 'a';

    const $updated = sut.create($existing);

    expect($updated).toBe($existing);
    expect($updated.href).toContain('/hahababa');
    expect($updated.textContent).toContain('a');
  });
});
