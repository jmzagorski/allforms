import { ExcelEngine } from '../../../../src/functions/excel/engine';
import { Lookup, MACROS } from '../../../../src/functions/excel/macros';
import { setupSpy } from '../../jasmine-helpers';
import using from 'jasmine-data-provider';
import * as parser from 'handsontable/formula-parser';
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
  let replaceSpy;

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
    replaceSpy = spyOn(utils, 'replaceBetween');
  });

  it('returns the supported formulas', () => {
    const formulas = parser.SUPPORTED_FORMULAS.concat(MACROS);
    expect(sut.functions).toEqual(formulas);
  });

  it('sets the variable when an argument is an object', async done => {
    const formula = '';
    const args = { key: 'val' };
    isObjSpy.and.returnValue(true);
    indicesSpy.and.returnValue([]);

    await sut.parse(formula, args);

    expect(parserSpy.setVariable).toHaveBeenCalledWith('key', 'val');
    done();
  });

  it('transforms any macros in order', async done => {
    const formula = 'MACROSTUB1+MACROSTUB2+1';
    const expectFormula = 'a';
    macroStub1.transform.and.returnValue('c');
    isObjSpy.and.returnValue(false);
    indicesSpy.and.returnValues([2], [1]);
    replaceSpy.and.returnValues('MACROSTUB1+Replace1+1', 'Replace2+Replace1+1');
    charPosSpy.and.returnValues(7,8);
    parserSpy.parse.and.returnValue(expectFormula)

    macroStub2.transform.and.callFake(arg => {
      expect(macroStub1.transform.calls.count()).toEqual(0);
      return 'd';
    });

    const actualFormula = await sut.parse(formula, 6, 7, 8);

    expect(indicesSpy.calls.argsFor(0)).toEqual(['MACROSTUB1', formula])
    expect(indicesSpy.calls.argsFor(1)).toEqual(['MACROSTUB2', formula])
    expect(macroStub2.transform.calls.count()).toEqual(1);
    // todo is this right?
    expect(macroStub2.transform).toHaveBeenCalledWith([6, 7, 8]);
    expect(macroStub1.transform.calls.count()).toEqual(1);
    // todo is this right?
    expect(macroStub1.transform).toHaveBeenCalledWith([6, 7, 8]);
    // 11 is the index of MACROSTUB2 in the formula
    expect(charPosSpy.calls.count()).toEqual(2);
    expect(charPosSpy.calls.argsFor(0)).toEqual([formula, 11, '(']);
    expect(charPosSpy.calls.argsFor(1)).toEqual(['MACROSTUB1+Replace1+1', 0, '(']);
    expect(replaceSpy.calls.argsFor(0)).toEqual([formula, 11, 8, 'd'])
    expect(replaceSpy.calls.argsFor(1)).toEqual(['MACROSTUB1+Replace1+1', 0, 9, 'c'])
    expect(parserSpy.parse).toHaveBeenCalledWith('Replace2+Replace1+1')
    expect(actualFormula).toEqual(expectFormula);
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
