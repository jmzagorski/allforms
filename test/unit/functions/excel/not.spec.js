import { xl_not } from '../../../../src/functions/excel'

describe('the not excel function', () => {

  it('evaluates true when all are false', () => {
    const segments = [false, null, undefined, 0];

    const actual = xl_not(segments);

    expect(actual).toBeTruthy();
  });

  it('evaluates false when one is true', () => {
    const segments = ['a','b'];

    const actual = xl_not(segments);

    expect(actual).toBeFalsy();
  });
});
