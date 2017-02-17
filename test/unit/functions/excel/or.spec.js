import { xl_or } from '../../../../src/functions/excel'

describe('the or excel function', () => {

  it('evaluates false', () => {
    const segments = [false, false];

    const result = xl_or(segments);

    expect(result).toBeFalsy();
  });

  it('evaluates true', () => {
    const segments = [true,false];

    const result = xl_or(segments);

    expect(result).toBeTruthy();
  });
});
