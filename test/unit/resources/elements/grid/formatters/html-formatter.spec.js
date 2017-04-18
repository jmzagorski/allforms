import { HtmlFormatter } from '../../../../../../src/resources/elements/grid/formatters/html-formatter';
import { HTMLSanitizer } from 'aurelia-templating-resources';
import { setupSpy } from '../../../../jasmine-helpers';

describe('the custom html grid formatter', () => {
  let sut;
  let sanitizerSpy;

  beforeEach(() => {
    sanitizerSpy = setupSpy('santizer', HTMLSanitizer.prototype);
    sut = new HtmlFormatter(sanitizerSpy);
  });

  it('returns the value when cannot find the custom html property', () => {
    const expected = {};

    const actual = sut.format(null, null, expected, { custom: {} }, null);

    expect(actual).toBe(expected)
  });

  [ { value: 'b' ,expected: 'c&nbsp;b' },
    { value: null, expected: 'c&nbsp;' }
  ].forEach(rec => {
    it('sanitizes the html', () => {
      const html = 'a';
      sanitizerSpy.sanitize.and.returnValue('c');

      const actual = sut.format(null, null, rec.value, { custom: { html } }, null);

      expect(actual).toEqual(rec.expected)
    });
  });
});
