import { xl_sum } from '../../../../src/functions/excel'

describe('the excel sum function', () => {

  it('should sum the segments', () => {
    const segments = [ 1, 2 ];

    const result = xl_sum(segments);

    expect(result).toEqual(3);
  });
});
