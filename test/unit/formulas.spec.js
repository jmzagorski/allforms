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
      sut.activate({ formula: 'a' });
      xlSpy.parse.and.returnValue({ result: 'b', error: data.error })

      await sut.verify();

      expect(xlSpy.parse).toHaveBeenCalledWith('a');
      expect(sut.verified).toEqual(data.verified)
      expect(sut.verifyMessage).toEqual(data.message)
      done();
    });
  });
});
