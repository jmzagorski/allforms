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

      parserSpy.getVariableValue.and.returnValues(1, data.table);
      parserSpy.getVariables.and.returnValue(['a', 'b']);
      parserSpy.getValues.and.returnValue([4])
      httpStub.itemStub = returnObj;

      const newFormula = await sut.run(parserSpy, formula);

      // FIXME
      expect(newFormula).toEqual(`CONCATENATE(LOOKUPTablea1)`);
      ////expect(newFormula).toEqual(`VLOOKUP(1, tableLOOKUPab1, 1, true)`);
      expect(parserSpy.getVariables.calls.argsFor(0)).toEqual([ formula ] );
      expect(parserSpy.getValues.calls.argsFor(0)).toEqual([ formula ] );
      expect(parserSpy.getVariableValue.calls.argsFor(0)).toEqual([ 'a' ]);
      expect(parserSpy.getVariableValue.calls.argsFor(1)).toEqual([ 'LOOKUPTablea1' ]);
      //expect(parserSpy.setVariable).toHaveBeenCalledWith('LOOKUPTablea1', data.newTable);
      expect(parserSpy.setVariable.calls.argsFor(0)).toEqual(['LOOKUPTablea1', 9]);
      done();
    });
  });
});
