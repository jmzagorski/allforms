import { xl_in } from '../../../../src/functions/excel'

describe('the in excel function', () => {

  it('evaluates true when in array', () => {
    const segments = ['1','2', '3', '1'];

    /* act */
    const actual = xl_in(segments);

    /* assert */
    expect(actual).toBeTruthy();
  });

  it('evaluates false with not in array', () => {
    const segments = ['1','2','3'];

    const actual = xl_in(segments);

    expect(actual).toBeFalsy();
  });
});
