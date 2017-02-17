import { xl_if } from '../../../../src/functions/excel'

describe('the if excel function', () => {

  using([
    { logic: false, expected: '3' },
    { logic: true, expected: '2' }
  ], data => {
    it('evaluates with 3 segments', () => {
      const segments = [data.logic, '2', '3'];

      const result = xl_if(segments);

      expect(result).toEqual(data.expected);
    });
  });

  using([
    { logic: false, expected: false },
    { logic: true, expected: '2' }
  ], data => {
    it('evaluates with 2 segments', () => {
      const segments = [data.logic, '2'];

      const result = xl_if(segments);

      expect(result).toEqual(data.expected);
    });
  });

  using([
    { logic: false, expected: false },
    { logic: true, expected: true }
  ], data => {
    it('evaluates with 1 segments', () => {
      const segments = [data.logic];

      const result = xl_if(segments);

      expect(result).toEqual(data.expected);
    });
  });
});
