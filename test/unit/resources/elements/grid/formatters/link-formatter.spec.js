import { LinkFormatter } from '../../../../../../src/resources/elements/grid/formatters/link-formatter';

describe('the custom link grid formatter', () => {

  it('splits the URl so the last segment is the content', () => {
    const sut = new LinkFormatter();
    const value = '#/ad/asd/showme';

    const actual = sut.format(null, null, value, null, null);

    expect(actual).toEqual('<a href="#/ad/asd/showme">showme</a>');
  });
});
