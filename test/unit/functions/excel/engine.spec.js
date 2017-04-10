import { ExcelEngine } from '../../../../src/functions/excel/engine';
import { setupSpy } from '../../jasmine-helpers';
import * as parser from 'hot-formula-parser';
import * as utils from '../../../../src/utils';

describe('the excel engine', () => {
  let sut;
  let parserSpy;
  let macroFactorySpy;
  let macroFactoryMock;
  let indicesSpy;
  let charPosSpy;

  beforeEach(() => {
    parserSpy = setupSpy('parser', parser.Parser.prototype);
    macroFactorySpy = jasmine.createSpy('macro');

    macroFactoryMock = {
      run: macroFactorySpy, 
      macros: [ 'amacro' ]
    }

    sut = new ExcelEngine(parserSpy, macroFactoryMock);

    // set default responses
    indicesSpy = spyOn(utils, 'getIndicesOf');
    charPosSpy = spyOn(utils, 'getEndingCharPos');
  });

  it('returns the supported formulas', () => {
    const expected = [
      ...parser.SUPPORTED_FORMULAS,
      'AMACRO'
    ]

    expect(sut.functions).toEqual(expected);
  });

  it('uses the cache if the result is calulcated', async done => {
    const formula = 'a';
    parserSpy.getVariable.and.returnValue(1);

    const result = await sut.parse(formula);

    expect(result).toEqual(1);
    expect(parserSpy.getVariable).toHaveBeenCalledWith(formula);
    expect(parserSpy.parse).not.toHaveBeenCalled();
    done();
  });

  it('transforms any macros in order', async done => {
    const formula = 'MACROSTUB2(C+D)+MACROSTUB1(A+B)+1+E';
    const expectFormula = 'D+C+1+E';

    macroFactoryMock.macros = [ 'macrostub1', 'macrostub2' ];
    // fake that MACROSTUB2 is really in front of MACROSTUB1 to test order
    indicesSpy.and.returnValues([16], [0]);
    // this needs to be right because getVariables will run its logic
    charPosSpy.and.returnValues(14,30);
    parserSpy.parse.and.returnValue('final result');

    macroFactorySpy.and.returnValues('Z', 'Y');

    sut = new ExcelEngine(parserSpy, macroFactoryMock);
    const actualFormula = await sut.parse(formula);

    expect(indicesSpy.calls.count()).toEqual(2);
    expect(indicesSpy.calls.argsFor(0)).toEqual(['MACROSTUB1', formula])
    expect(indicesSpy.calls.argsFor(1)).toEqual(['MACROSTUB2', formula])
    expect(charPosSpy.calls.count()).toEqual(2);
    expect(charPosSpy.calls.argsFor(0)).toEqual([formula, 0, '(']);
    expect(charPosSpy.calls.argsFor(1)).toEqual([formula, 16, '(']);
    expect(macroFactorySpy.calls.count()).toEqual(2);
    expect(macroFactorySpy.calls.argsFor(0)).toEqual([ 'MACROSTUB2', sut, 'MACROSTUB2(C+D)' ])
    expect(macroFactorySpy.calls.argsFor(1)).toEqual([ 'MACROSTUB1', sut, 'MACROSTUB1(A+B)' ])
    expect(parserSpy.parse).toHaveBeenCalledWith('Z+Y+1+E')
    expect(actualFormula).toEqual('final result');
    done();
  });

  it('caches the parsed result', async done => {
    const formula = 'a';
    parserSpy.parse.and.returnValue(1);
    // skip macro calls since i already loaded one macro in beforeEach
    indicesSpy.and.returnValue([]);

    const result = await sut.parse(formula);

    expect(parserSpy.setVariable).toHaveBeenCalledWith(formula, result);
    done();
  });

  it('gets all the variables in the formula', () => {
    const formula = 'IF(AB,SUM(AC,2),"http://api.com","Hi")';

    const variables = sut.getVariables(formula);

    expect(variables).toEqual(['AB', 'AC'])
  });

  it('calls to set the variable with the value', () => {
    sut.setVariable('a', 1);

    expect(parserSpy.setVariable).toHaveBeenCalledWith('a', 1);
  });

  it('calls to get the variable value', () => {
    const expected = 1;
    parserSpy.getVariable.and.returnValue(expected);

    const actual = sut.getVariableValue('a');

    expect(parserSpy.getVariable).toHaveBeenCalledWith('a');
    expect(actual).toEqual(expected);
  });

  it('gets all the values in the formula', () => {
    const formula = 'IF(AB,SUM(AC,2),"http://api.com","Hi")';

    const values = sut.getValues(formula);

    expect(values).toEqual(['2', 'http://api.com', 'Hi'])
  });
});
