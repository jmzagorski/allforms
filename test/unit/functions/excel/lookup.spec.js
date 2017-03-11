import { HttpClient } from 'aurelia-fetch-client';
import { Lookup } from '../../../../src/functions/excel/macros';
import { setupSpy } from '../../jasmine-helpers';
import { Parser } from 'handsontable/formula-parser';
import using from 'jasmine-data-provider';

describe('the excel lookup macro', () => {
  let sut;
  let httpSpy;
  let parserSpy;

  beforeEach(() => {
    httpSpy = setupSpy('http', HttpClient.prototype);
    parserSpy = setupSpy('parser', Parser.prototype);
    sut = new Lookup(httpSpy, parserSpy);
  });

  it('configures a new http client', () => {
    let isStandard = false;
    let pFunc = null;
    let config = {
      useStandardConfiguration: () => isStandard = true
    };
    httpSpy.configure.and.callFake(func => pFunc = func);

    const psut = new Lookup(httpSpy);
    pFunc(config);

    expect(config).not.toEqual(null);
    expect(isStandard).toBeTruthy();
  });

  it('calls the apis to get the lookup data', async done => {
    const lookupObj = { a: 1 };
    const returnName = 'b';
    const metadata = { api: 'c' };
    httpSpy.fetch.and.returnValues(Promise.resolve(metadata), Promise.resolve({}));

    await sut.transform(lookupObj, returnName);

    expect(httpSpy.fetch.calls.argsFor(0)).toEqual(['lookups/a']);
    expect(httpSpy.fetch.calls.argsFor(1)).toEqual(['c/1']);
    done();
  });

  using([
    { table: [[1,2]], newTable: [[1,2],[4,9]] },
    { table: undefined, newTable: [[4,9]] }
  ], data => {
    it('transforms the lookup macro into vlookup', async done => {
      const lookupObj = { a: 1 };
      const returnName = 'b';
      const retObj = { c: 4, b: 9 };
      const metadata = { api: '' };

      httpSpy.fetch.and.returnValues(Promise.resolve(metadata), Promise.resolve(retObj));
      parserSpy.getVariable.and.returnValue(data.table);

      const formula = await sut.transform(lookupObj, returnName);

      expect(formula).toEqual('VLOOKUP(1, atable, 1, true)');
      expect(parserSpy.getVariable).toHaveBeenCalledWith('atable');
      expect(parserSpy.setVariable).toHaveBeenCalledWith('atable', data.newTable);
      done();
    });
  });

});
