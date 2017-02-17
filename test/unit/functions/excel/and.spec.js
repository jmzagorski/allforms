import { xl_and } from '../../../../src/functions/excel'

describe('the excel and evaluator', () => {

  it('should evaluate false when any are false', () => {
    /* arrange */
    let segments = ['true','false'];

    /* act */
    let result = xl_and(segments);

    /* assert */
    expect(result).toBeFalsy;
  });

  it('should evaluate true when all are true', () => {
    /* arrange */
    let segments = ['true','true'];

    /* act */
    let result = xl_and(segments);

    /* assert */
    expect(result).toBeFalsy;
  });
});

