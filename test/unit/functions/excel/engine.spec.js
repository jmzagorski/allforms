import { ExcelEngine } from '../../../../src/functions/excel/engine';
import { Lookup, MACROS } from '../../../../src/functions/excel/macros';
import { setupSpy } from '../../jasmine-helpers';
import using from 'jasmine-data-provider';
import * as parser from 'hot-formula-parser';
import * as utils from '../../../../src/utils';

// use stub clases so i can grab the name, i dont like jasmine spy names
class MacroStub1 { }
class MacroStub2 { }

describe('the excel engine', () => {
  let sut;
  let parserSpy;
  let macroStub1;
  let macroStub2;
  let isObjSpy;
  let indicesSpy;
  let charPosSpy;

  beforeEach(() => {
    parserSpy = setupSpy('parser', parser.Parser.prototype);
    macroStub1 = new MacroStub1()
    macroStub2 = new MacroStub2()
    macroStub1.transform = jasmine.createSpy('transform1');
    macroStub2.transform = jasmine.createSpy('transform2');
    sut = new ExcelEngine(parserSpy, [ macroStub1, macroStub2 ]);

    // set default responses
    isObjSpy = spyOn(utils, 'isObject');
    indicesSpy = spyOn(utils, 'getIndicesOf');
    charPosSpy = spyOn(utils, 'getEndingCharPos');
  });

  it('returns the supported formulas', () => {
    const formulas = parser.SUPPORTED_FORMULAS.concat(MACROS);
    expect(sut.functions).toEqual(formulas);
  });

  it('sets the variable when an argument is an object', async done => {
    const formula = '';
    const args = { key: 'val', last: 'value' };
    // skip macro expansion
    indicesSpy.and.returnValue([]);

    await sut.parse(formula, args);

    expect(parserSpy.setVariable.calls.argsFor(0)).toEqual([ 'key', 'val' ]);
    expect(parserSpy.setVariable.calls.argsFor(1)).toEqual([ 'last', 'value' ]);
    done();
  });

  // FIXME: kind of testing too much?
  it('transforms any macros in order', async done => {
    const formula = 'MACROSTUB2(C+D)+MACROSTUB1(A+B)+1+E';
    const expectFormula = 'D+C+1+E';
    const variables = { A: 1, B: 2, C: 3, D: 4 };
    // fake that MACROSTUB2 is really in front of MACROSTUB1 to test order
    indicesSpy.and.returnValues([16], [0]);
    // this needs to be right because getVariables will run its logic
    charPosSpy.and.returnValues(14,30);
    parserSpy.parse.and.returnValue('final result');
    parserSpy.getVariable.and.returnValues(3, 4, 1, 2);

    macroStub2.transform.and.callFake(arg => {
      expect(macroStub1.transform.calls.count()).toEqual(0);
      return 'D';
    });
    macroStub1.transform.and.returnValue('C');

    const actualFormula = await sut.parse(formula, variables);

    expect(indicesSpy.calls.count()).toEqual(2);
    expect(indicesSpy.calls.argsFor(0)).toEqual(['MACROSTUB1', formula])
    expect(indicesSpy.calls.argsFor(1)).toEqual(['MACROSTUB2', formula])
    expect(charPosSpy.calls.count()).toEqual(2);
    expect(charPosSpy.calls.argsFor(0)).toEqual([formula, 0, '(']);
    expect(charPosSpy.calls.argsFor(1)).toEqual([formula, 16, '(']);
    expect(macroStub1.transform.calls.count()).toEqual(1);
    expect(macroStub1.transform).toHaveBeenCalledWith([1, 2])
    expect(macroStub2.transform.calls.count()).toEqual(1);
    expect(macroStub2.transform).toHaveBeenCalledWith([3, 4])
    expect(parserSpy.parse).toHaveBeenCalledWith('D+C+1+E')
    expect(actualFormula).toEqual('final result');
    done();
  });

  it('gets all the variables in the formula', () => {
    const formula = 'IF(AB,SUM(AC,2),"Hi")';

    const variables = sut.getVariables(formula);

    expect(variables).toEqual(['AB', 'AC'])
  });

  it('calls to set the variable with the value', () => {
    sut.setVariable('a', 1);

    expect(parserSpy.setVariable).toHaveBeenCalledWith('a', 1);
  });

});
