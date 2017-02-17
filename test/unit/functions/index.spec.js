import { evaluate } from '../../../src/functions';
import * as excel from '../../../src/functions/excel';
import using from 'jasmine-data-provider';

describe('the function evaluator', () => {

  it('throws an error when cant find the formula group', () => {
    const ex = () => evaluate('notexcel');

    expect(ex).toThrow(new Error('notexcel is not a supported function group.'));
  });

  it('throws an error when cant find the function', () => {
    const ex = () => evaluate('excel', 'zzz');

    expect(ex).toThrow(new Error('Unsupported function zzz from excel.'));
  });

  using(['if', 'IF', 'IF ', 'iF', 'If'], func => {
    it('runs the function', () => {
      const ifSpy = spyOn(excel, 'xl_if');
      const args = ['a'];

      const result = evaluate('excel', func, args);

      expect(ifSpy).toHaveBeenCalledWith(args);
    });
  });
});
