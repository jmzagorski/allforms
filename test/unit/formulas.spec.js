import './setup';
import { Formulas } from '../../src/formulas';
import { ExcelEngine } from '../../src/functions/excel/engine';
import using from 'jasmine-data-provider';

describe('the formulas view model', () => {
  let sut;
  let xlSpy;

  beforeEach(() => {
    xlSpy = jasmine.setupSpy('xl', ExcelEngine.prototype);

    xlSpy.functions = 1;
    sut = new Formulas(xlSpy);
  });

  it('instantiates the view model', () => {
    expect(sut.funcNames).toEqual(1);
    expect(sut.verified).toBeFalsy();
    expect(sut.verifyMessage).toEqual(null);
  });

  it('sets the element to the model on activate', () => {
    const element = {};

    sut.activate(element);

    expect(sut.element).toBe(element);
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
