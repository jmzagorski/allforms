import * as textarea from '../../../src/elements/textarea';

describe('the textarea element', () => {

  it('has bootstrap textarea properties', () => {
    const sut = textarea.bootstrap();

    expect(sut.name).toBeDefined();
    expect(sut.required).toBeFalsy();
    expect(sut.text).toBeDefined();
    expect(sut.rows).toEqual(5);
    expect(sut.schema).toBeDefined();
    expect(sut.schema).toContain('text.html');
    expect(sut.schema).toContain('name.html');
    expect(sut.schema).toContain('input.html');
    expect(sut.schema).toContain('textarea.html');
  });

  it('creates a bootstrap text area', () => {
    const sut = textarea.bootstrap();
    sut.name = 'a'
    sut.required = true;
    sut.text = 'b';
    sut.rows = 6;

    const $elem = sut.create();

    expect($elem.tagName).toEqual('DIV');
    expect($elem.className).toEqual('form-group');

    const $label = $elem.children[0];
    expect($label.tagName).toEqual('LABEL');
    expect($label.textContent).toEqual('b');

    const $textarea = $elem.children[1];
    expect($textarea.className).toEqual('form-control');
    expect($textarea.rows).toEqual(6);
    expect($textarea.required).toBeTruthy();
    expect($textarea.name).toEqual('a');
  });

  it('mutates a bootstrap text area', () => {
    const sut = textarea.bootstrap();
    sut.name = 'a'
    sut.text = 'b';
    sut.rows = 6;
    const $existing = sut.create();
    sut.required = true;
    sut.name = 'c'
    sut.text = 'd';
    sut.rows = 7;

    const $updated = sut.create($existing);

    expect($updated).toBe($existing);

    const $label = $updated.children[0];
    expect($label.textContent).toEqual('d');

    const $textarea = $updated.children[1];
    expect($textarea.rows).toEqual(7);
    expect($textarea.required).toBeTruthy();
    expect($textarea.name).toEqual('c');
  });
});
