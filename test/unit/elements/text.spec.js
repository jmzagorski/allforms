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

  [ { max: 3, pattern: '.{1,3}', title: '3' },
    { max: null, pattern: '.{1,}', title: 'infinite' },
    { max: '', pattern: '.{1,}', title: 'infinite' },
    { max: undefined, pattern: '.{1,}', title: 'infinite' }
  ].forEach(data => {
    it('creates the pattern attribute on the text', () => {
      const sut = text.bootstrap();
      sut.min = 1;
      sut.max = data.max;

      const $elem = sut.create();

      expect($elem.children[1].getAttribute('pattern')).toEqual(data.pattern);
      expect($elem.children[1].getAttribute('title')).toEqual(`1 to ${data.title} characters`);
    });
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

  it('adds the duplicate option for new elements', () => {
    const sut = text.bootstrap();
    const duplicatorSpy = spyOn(sut, 'duplicate');

    const $elem = sut.create();

    const $input = $elem.querySelector('input');

    expect(duplicatorSpy).toHaveBeenCalledWith($input);
    expect(duplicatorSpy.calls.count()).toEqual(1);
  });

  it('does not add the duplicate option for existing elements', () => {
    const sut = text.bootstrap();
    const duplicatorSpy = spyOn(sut, 'duplicate');
    const $elem = sut.create();
    duplicatorSpy.calls.reset();

    sut.create($elem);

    expect(duplicatorSpy).not.toHaveBeenCalledWith();
  });
});
