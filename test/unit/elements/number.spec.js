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
});
