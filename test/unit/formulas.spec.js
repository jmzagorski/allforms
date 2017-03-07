import './setup';
import { Formulas } from '../../src/formulas';
import { ExcelEngine } from '../../src/functions/excel/engine';
import { TemplateApi } from '../../src/api/template-api';
import using from 'jasmine-data-provider';

describe('the formulas view model', () => {
  let sut;
  let xlSpy;
  let templApiSpy;

  beforeEach(() => {
    xlSpy = jasmine.setupSpy('xl', ExcelEngine.prototype);
    templApiSpy = jasmine.setupSpy('templApi', TemplateApi.prototype);

    xlSpy.functions = [ 1 ];
    sut = new Formulas(xlSpy, templApiSpy);

    templApiSpy.find.and.returnValue({ elements: [] });
  });

  it('instantiates the view model', () => {
    expect(sut.funcNames).toEqual([1]);
    expect(sut.verified).toBeFalsy();
    expect(sut.verifyMessage).toEqual(null);
    expect(sut.variables).toEqual([]);
    expect(sut.element).toBeDefined();
  });

  it('sets the element to the model on activate', async done => {
    const element = {};

    await sut.activate(element);

    expect(sut.element).toBe(element);
    done();
  });

  it('pushes the template elements into the func names', async done => {
    const elements = [{ name: 'a' }, { name: 'b' }];
    templApiSpy.find.and.returnValue({ elements })

    await sut.activate({ formId: 1 });

    expect(sut.funcNames).toContain('a')
    expect(sut.funcNames).toContain('b')
    expect(templApiSpy.find).toHaveBeenCalledWith(1);
    done();
  });

  using([
    { error: null, verified: true, message: 'b' },
    { error: undefined, verified: true, message: 'b' },
    { error: 'xlerr', verified: false, message: 'xlerr' }
  ], data => {
    it('verifies the formula', async done => {
      const var1 = { name: 'a', value: 1 };
      const var2 = { name: 'b', value: 2 };
      sut.variables = [ var1, var2 ];
      sut.activate({ formula: 'a' });
      xlSpy.parse.and.returnValue({ result: 'b', error: data.error })

      await sut.verify();

      expect(xlSpy.setVariable.calls.count()).toEqual(2);
      expect(xlSpy.setVariable.calls.argsFor(0)).toEqual(['a', 1]);
      expect(xlSpy.setVariable.calls.argsFor(1)).toEqual(['b', 2]);
      expect(xlSpy.parse).toHaveBeenCalledWith('a');
      expect(sut.verified).toEqual(data.verified)
      expect(sut.verifyMessage).toEqual(data.message)
      done();
    });
  });

  using([ null, {} ], element => {
    it('does not attempt to show variable with no element', () => {
      sut.element = element;
      sut.showVariables();

      expect(xlSpy.getVariables).not.toHaveBeenCalled();
    });
  });

  it('pushes the variables into a name/value object', () => {
    sut.element = { formula: 'A' };
    xlSpy.getVariables.and.returnValue(['B', 'C']);

    sut.showVariables();

    expect(sut.variables).toEqual([{ name: 'B', value: ''}, { name: 'C', value: ''}]);
    expect(xlSpy.getVariables).toHaveBeenCalledWith('A');
  });

  it('clears the variables for every show variables call', () => {
    sut.element = { formula: 'A' };
    xlSpy.getVariables.and.returnValue(['B', 'C']);
    sut.showVariables();

    sut.showVariables();

    expect(sut.variables).toEqual([{ name: 'B', value: ''}, { name: 'C', value: ''}]);
  });
});
