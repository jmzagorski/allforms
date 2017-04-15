import Formatter from '../../../../src/resources/elements/grid-formatters';

describe('the custom grid formatters', () => {

  [ { value: 1, def: { formatterOpts: {} }, expect: 1 },
    { value: 1, def: { formatterOpts: { html: 2 } }, expect: 2 }
  ].forEach(data => {
    it('sets the html to the formatter option value if availabe or value', () => {
      const actual = Formatter.Html(null, null, data.value, data.def, null);

      expect(actual).toEqual(data.expect);
    });
  });

  it('splits the URl so the last segment is the content', () => {
    const value = '#/ad/asd/showme';

    const actual = Formatter.Link(null, null, value, null, null);

    expect(actual).toEqual('<a href="#/ad/asd/showme">showme</a>')
  });
});
