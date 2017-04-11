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
    parserSpy.getVariables.and.returnValue(['a','b']);
    parserSpy.getValues.and.returnValue([1,2]);
    parserSpy.getVariableValue.and.returnValues(3, expected);

    const actual = await sut.run(parserSpy, 'formula')

    expect(actual).toEqual(expected);
    expect(parserSpy.getVariables).toHaveBeenCalledWith('formula');
    expect(parserSpy.getValues).toHaveBeenCalledWith('formula');
    expect(parserSpy.getVariableValue).toHaveBeenCalledWith('LOOKUPa312');
    done();
  });

  [ { default: null, returned: 'a', expected: 'a?c=1' },
    { default: undefined, returned: 'b', expected: 'b?c=1' },
    { default: '', returned: 'd' , expected: 'd?c=1'},
    { default: 'api', returned: '', expected: 'api?c=1' }
  ].forEach(api => {
    it('calls the apis to get the lookup row', async done => {
      sut = new Lookup(httpStub, api.default);
      parserSpy.getVariables.and.returnValue(['c', 'b']);
      parserSpy.getValues.and.returnValue([api.returned]);
      parserSpy.getVariableValue.and.returnValues(1, null)

      await sut.run(parserSpy, 'formula');

      expect(httpStub.url).toEqual(api.expected);
      done();
    });
  });

  [ { table: [['a', 1,2]], newTable: [['a', 1,2],['a', 4,9]] },
    { table: undefined, newTable: [['a', 4,9]] }
  ].forEach(data => {
    it('transforms the lookup macro into vlookup', async done => {
      const returnObj = { c: 4, b: 9 };
      const formula = 'formula';

      parserSpy.getVariableValue.and.returnValues(1, null, data.table);
      parserSpy.getVariables.and.returnValue(['a', 'b']);
      parserSpy.getValues.and.returnValue([4])
      httpStub.itemStub = returnObj;

      const newFormula = await sut.run(parserSpy, formula);

      // FIXME
      expect(newFormula).toEqual(`CONCATENATE(tableLOOKUPa14)`);
      //expect(newFormula).toEqual(`VLOOKUP(1, tableLOOKUPab1, 1, true)`);
      expect(parserSpy.getVariableValue.calls.argsFor(0)).toEqual([ 'a' ]);
      expect(parserSpy.getVariableValue.calls.argsFor(2)).toEqual([ `tableLOOKUPa14` ]);
      //expect(parserSpy.setVariable).toHaveBeenCalledWith('tableLOOKUPa1', data.newTable);
      expect(parserSpy.setVariable.calls.argsFor(0)).toEqual(['tableLOOKUPa14', 9]);
      expect(parserSpy.setVariable.calls.argsFor(1)).toEqual(['LOOKUPa14', newFormula]);
      done();
    });
  });
});
