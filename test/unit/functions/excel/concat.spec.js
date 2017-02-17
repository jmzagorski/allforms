import { xl_concat } from '../../../../src/functions/excel'

describe('the excel concat function', () => {

  it('should perform real evaluate concatenation', () => {
    const segments = ['1','2',','];
    const expected = '12,';

    const actual = xl_concat(segments);

    /* assert */
    expect(actual).toEqual(expected);
  });
});
