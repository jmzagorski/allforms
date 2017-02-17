import { xl_min } from '../../../../src/functions/excel'

describe('the min excel function', () => {

  it('evaluates Math.min with segments', () => {
    const segments = [1,2];

    const result = xl_min(segments);

    expect(result).toEqual(1);
  });
});
