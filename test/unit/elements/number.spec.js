import * as number from '../../../src/elements/number';

describe('the number element', () => {
  it('has bootstrap number properties', () => {
    const sut = number.bootstrap();

    expect(sut.name).toBeDefined();
    expect(sut.required).toBeFalsy();
    expect(sut.text).toBeDefined();
    expect(sut.min).toBeDefined();
    expect(sut.max).toBeDefined();
    expect(sut.schema).toBeDefined();
    expect(sut.schema).toContain('text.html');
    expect(sut.schema).toContain('name.html');
    expect(sut.schema).toContain('range.html');
    expect(sut.schema).toContain('input.html');
  });

  it('adds the duplicate option for new elements', () => {
    const sut = number.bootstrap();
    const duplicatorSpy = spyOn(sut, 'duplicate');

    const $elem = sut.create();

    const $input = $elem.querySelector('input');

    expect(duplicatorSpy).toHaveBeenCalledWith($input);
    expect(duplicatorSpy.calls.count()).toEqual(1);
  });

  it('does not add the duplicate option for existing elements', () => {
    const sut = number.bootstrap();
    const duplicatorSpy = spyOn(sut, 'duplicate');
    const $elem = sut.create();
    duplicatorSpy.calls.reset();

    sut.create($elem);

    expect(duplicatorSpy).not.toHaveBeenCalledWith();
  });
});
