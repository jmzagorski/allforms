import { xl_max } from '../../../../src/functions/excel'

describe('the max excel function', () => {

  it('evaluates Math.max with segments', () => {
    const segments = [1,2];

    const result = xl_max(segments);

    expect(result).toEqual(2);
  });
});
