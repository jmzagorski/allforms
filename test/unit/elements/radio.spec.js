import * as radio from '../../../src/elements/radio';

describe('the radio element', () => {

  it('has bootstrap radio properties', () => {
    const sut = radio.bootstrap();

    expect(sut.required).toBeFalsy();
    expect(sut.text).toBeDefined();
    expect(sut.name).toBeDefined();
    expect(sut.options).toBeDefined();
    expect(sut.schema).toBeDefined();
    expect(sut.schema).toContain('text.html');
    expect(sut.schema).toContain('name.html');
    expect(sut.schema).toContain('input.html');
    expect(sut.schema).toContain('options.html');
  });
});
