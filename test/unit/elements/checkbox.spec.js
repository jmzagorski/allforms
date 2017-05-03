import * as checkbox from '../../../src/elements/checkbox';

describe('the checkbox element', () => {

  it('has bootstrap checkbox properties', () => {
    const sut = checkbox.bootstrap();

    expect(sut.required).toBeFalsy();
    expect(sut.text).toBeDefined();
    expect(sut.options).toBeDefined();
    expect(sut.name).toBeDefined();
    expect(sut.schema).toBeDefined();
    expect(sut.schema).toContain('text.html');
    expect(sut.schema).toContain('input.html');
    expect(sut.schema).toContain('options.html');
  });
});
