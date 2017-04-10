import { Lookup } from '../../../../../src/functions/excel/macros/lookup';
import { setupSpy } from '../../../jasmine-helpers';
import { HttpStub } from '../../../stubs';
import { ExcelEngine } from '../../../../../src/functions/excel/engine';

describe('the excel lookup macro', () => {
  let sut;
  let httpStub;
  let parserSpy;
  let defaultApi

  beforeEach(() => {
    httpStub = new HttpStub();
    parserSpy = setupSpy('parser', ExcelEngine.prototype);
    defaultApi = 'a';
    sut = new Lookup(httpStub, defaultApi);
  });

  it('uses the cached result if available', async done => {
    const expected = 'a';
    parserSpy.getVariableValue.and.returnValue('a');
    parserSpy.getValues.and.returnValue([1,2]);
    parserSpy.getVariables.and.returnValue([3,4]);

    const actual = await sut.run(parserSpy, 'b')

    expect(actual).toEqual(expected);
    expect(parserSpy.getVariableValue).toHaveBeenCalledWith('LOOKUP3412');
    done();
  });

  [ { default: null, returned: 'a', expected: 'ac' },
    { default: undefined, returned: 'b', expected: 'bc' },
    { default: '', returned: 'd' , expected: 'dc'},
    { default: 'api', returned: '', expected: 'apic' }
  ].forEach(api => {
    it('calls the apis to get the lookup row', async done => {
      sut = new Lookup(httpStub, api.default);
      parserSpy.getVariables.and.returnValue(['c', 'b']);
      parserSpy.getValues.and.returnValue([api.returned]);

      await sut.run(parserSpy, 'formula');

      expect(httpStub.url).toEqual(api.expected);
      done();
    });
  });

  [ { table: [[1,2]], newTable: [[1,2],[4,9]] },
    { table: undefined, newTable: [[4,9]] }
  ].forEach(data => {
    it('transforms the lookup macro into vlookup', async done => {
      const returnObj = { c: 4, b: 9 };
      const formula = 'formula';

      parserSpy.getVariableValue.and.returnValues(null, 1, data.table);
      parserSpy.getVariables.and.returnValue(['a', 'b']);
      parserSpy.getValues.and.returnValue([1])
      httpStub.itemStub = returnObj;

      const newFormula = await sut.run(parserSpy, formula);

      expect(newFormula).toEqual(`VLOOKUP(1, tableLOOKUPab1, 1, true)`);
      expect(parserSpy.getVariableValue.calls.argsFor(1)).toEqual([ 'a' ]);
      expect(parserSpy.getVariableValue.calls.argsFor(2)).toEqual([ `tableLOOKUPab1` ]);
      expect(parserSpy.setVariable).toHaveBeenCalledWith('tableLOOKUPab1', data.newTable);
      expect(parserSpy.setVariable).toHaveBeenCalledWith('LOOKUPab1', newFormula);
      done();
    });
  });
});
