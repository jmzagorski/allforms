import './setup';
import * as formSelectors from '../../src/domain/form/form-selectors';
import * as elemSelectors from '../../src/domain/element/element-selectors';
import * as schemas from '../../src/schemas/index';
import { Metadata } from '../../src/metadata';
import { Store } from 'aurelia-redux-plugin';
import { DialogController } from 'aurelia-dialog';
import { ElementActions } from '../../src/domain/index';

describe('the design view model', () => {
  let sut;
  let elemActionSpy;
  let formSelectorSpy;
  let elemSelectorSpy;
  let storeSpy
  let dialogSpy;

  beforeEach(() => {
    elemActionSpy = jasmine.setupSpy('elemAction', ElementActions.prototype);
    storeSpy = jasmine.setupSpy('store', Store.prototype);
    dialogSpy = jasmine.setupSpy('dialog', DialogController.prototype);
    formSelectorSpy = spyOn(formSelectors, 'getActiveForm');
    elemSelectorSpy = spyOn(elemSelectors, 'getActiveElement');
    sut = new Metadata(elemActionSpy, dialogSpy, storeSpy);

    formSelectorSpy.and.returnValue({ name: 'a', style: 'bootstrap' });
  });

  it('instantiates the form object', () => {
    expect(sut.elemForm).toEqual({ schema: null, data: {} });
  });

  it('sets the data to the element that is loaded', async done => {
    const model = { id: 1, type: 'ab' };
    const element = {};
    const schema = {};
    const state = {};
    storeSpy.getState.and.returnValue(state);
    elemSelectorSpy.and.returnValue(element);
    schemas.bootstrap.ab = schema;

    await sut.activate(model);

    expect(elemActionSpy.loadElement).toHaveBeenCalledWith(1);
    expect(elemSelectorSpy).toHaveBeenCalledWith(state);
    expect(sut.elemForm.data).toBe(element);
    done();
  });

  it('sets the data to the default element from the schema', async done => {
    const model = { type: 'ab' };
    const schema = [{ default: 'zzz', key: 'someprop' }];
    schemas.bootstrap.ab = schema;

    await sut.activate(model);

    expect(elemActionSpy.loadElement).not.toHaveBeenCalled();
    expect(elemSelectorSpy).not.toHaveBeenCalled();
    expect(sut.elemForm.data).toEqual({ someprop: 'zzz', formName: 'a', formId: 'a' });
    done();
  });

  it('submits the form data', async done => {
    const element = {};
    elemSelectorSpy.and.returnValue(element);
    await sut.activate({ id: 1 })

    await sut.submit();

    expect(elemActionSpy.saveElement.calls.argsFor(0)[0]).toBe(element);
    expect(dialogSpy.ok.calls.argsFor(0)[0]).toBe(element);
    done();
  });

  it('cancels the dialog', async done => {
    await sut.cancel();

    expect(dialogSpy.cancel).toHaveBeenCalled();
    done();
  });
});
