import * as text from '../../../src/elements/text';

describe('the text element', () => {

  it('has bootstrap text properties', () => {
    const sut = text.bootstrap();

    expect(sut.name).toBeDefined();
    expect(sut.required).toBeFalsy();
    expect(sut.text).toBeDefined();
    expect(sut.min).toBeDefined();
    expect(sut.max).toBeDefined();
    expect(sut.schema).toBeDefined();
    expect(sut.schema).toContain('text.html');
    expect(sut.schema).toContain('name.html');
    expect(sut.schema).toContain('input.html');
    expect(sut.schema).toContain('range.html');
  });

  it('creates the pattern attribute on the text', () => {
    const sut = text.bootstrap();
    sut.min = 1;
    sut.max = 3;

    const $elem = sut.create();

    expect($elem.children[1].getAttribute('pattern')).toEqual('.{1,3}');
    expect($elem.children[1].getAttribute('title')).toEqual('1 to 3 characters');
  });

  it('updates the pattern attribute on the text', () => {
    const sut = text.bootstrap();
    sut.min = 1;
    sut.max = 3;
    const $existing = sut.create();
    sut.min++;
    sut.max++;

    const $updated = sut.create($existing);

    expect($updated.children[1].getAttribute('pattern')).toEqual('.{2,4}');
    expect($updated.children[1].getAttribute('title')).toEqual('2 to 4 characters');
  });
});
