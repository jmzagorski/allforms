import * as typeSelectors from '../../src/domain/element-type/selectors';
import * as formSelectors from '../../src/domain/form/selectors';
import { Design } from '../../src/design';
import { Store } from 'aurelia-redux-plugin';
import { DialogService } from 'aurelia-dialog';
import { MetadataDialog } from '../../src/metadata-dialog';
import {
  requestForm,
  requestElementTypes,
  editFormTemplate
} from '../../src/domain/index';
import { setupSpy } from './jasmine-helpers';

describe('the design view model', () => {
  let sut;
  let elemTypeSelectorSpy;
  let formSelectorSpy;
  let storeSpy
  let dialogSpy;

  beforeEach(() => {
    storeSpy = setupSpy('store', Store.prototype);
    dialogSpy = setupSpy('dialog', DialogService.prototype);
    elemTypeSelectorSpy = spyOn(typeSelectors, 'getElementTypes');
    formSelectorSpy = spyOn(formSelectors, 'getActiveForm');
    sut = new Design(storeSpy, dialogSpy);

    formSelectorSpy.and.returnValue({ style: '', id: 'abc' });
  });

  it('instantiates properties to defaults', () => {
    expect(sut.html).toEqual('');
    expect(sut.style).toEqual(null);
    expect(sut.formId).toEqual(null);
    expect(sut.designer).toEqual({});
    expect(sut.interactable).toEqual('drag');
  });

  it('dispatches to get the form', () => {
    sut.activate({ form: 'a' });

    expect(storeSpy.dispatch).toHaveBeenCalledWith(requestForm('a'));
  });

  it('dispatches to request the element types', () => {
    sut.activate({ form: 'a' });

    expect(storeSpy.dispatch).toHaveBeenCalledWith(requestElementTypes());
  });

  it('gets the element types', () => {
    const state = {};
    const types = [];

    storeSpy.getState.and.returnValue(state);
    elemTypeSelectorSpy.and.returnValue(types)

    const elemTypes = sut.elementTypes;

    expect(elemTypeSelectorSpy.calls.argsFor(0)[0]).toBe(state)
    expect(sut.elementTypes).toBe(types);
  });

  it('subscribes to the store on activate', () => {
    sut.activate({ form: 'a' });

    expect(storeSpy.subscribe).toHaveBeenCalled();
  });

  it('updates the view model properties on update', () => {
    const state = {};
    const form = { template: 'b', style: 'a', id: 1 };
    let updateFunc = null;

    storeSpy.getState.and.returnValue(state);
    storeSpy.subscribe.and.callFake(func => updateFunc = func);
    formSelectorSpy.and.returnValue(form)

    sut.activate({ form: 'a' });
    updateFunc();

    expect(formSelectorSpy.calls.argsFor(0)[0]).toBe(state)
    expect(sut.html).toEqual('b');
    expect(sut.style).toEqual('a');
    expect(sut.formId).toEqual(1);
  });

  it('does not update the vie wmodel properties without a form', () => {
    let updateFunc = null;

    formSelectorSpy.and.returnValue(null);
    storeSpy.subscribe.and.callFake(func => updateFunc = func);
    sut.activate({ form: 'a' });

    updateFunc();

    expect(sut.style).toEqual(null);
    expect(sut.formId).toEqual(null);
  });

  it('always return an empty html string', () => {
    let updateFunc = null;

    formSelectorSpy.and.returnValue({})
    storeSpy.subscribe.and.callFake(func => updateFunc = func);

    sut.activate({ form: 'a' })
    updateFunc();

    expect(sut.html).toEqual('');
  });

  [ { builder: 'a' }, { detail: { model: { type: 'a' } } } ].forEach(event => {
    it('renders the element when dialog is ok', async done => {
      const dialogResult = { wasCancelled: false, output: {} };
      const designerSpy = jasmine.createSpy('createElement');

      dialogSpy.open.and.returnValue(dialogResult);

      sut.designer = {
        createElement: designerSpy,
        element:  { innerHTML: 'html' }
      };

      await sut.renderElement(event);

      expect(dialogSpy.open).toHaveBeenCalledWith({
        viewModel: MetadataDialog,
        model: { type: 'a'}
      });
      expect(designerSpy.calls.argsFor(0)[0]).toBe(dialogResult.output);
      done();
    });
  });

  it('saves the form template when dialog is ok', async done => {
    const dialogResult = { wasCancelled: false };
    const designerSpy = jasmine.createSpy('createElement');
    sut.formId = 'abc';

    sut.designer = {
      createElement: designerSpy,
      element:  { innerHTML: 'html' }
    };

    dialogSpy.open.and.returnValue(dialogResult);
    designerSpy.and.callFake(() => {
      expect(storeSpy.dispatch.calls.count()).toEqual(0);
    });

    await sut.renderElement({ builder: 'a' });

    expect(storeSpy.dispatch.calls.count()).toEqual(1);
    expect(storeSpy.dispatch.calls.argsFor(0)[0]).toEqual(editFormTemplate('html'));
    done();
  });

  it('does not create the element if dialog cancelled', async done => {
    const dialogResult = { wasCancelled: true, output: 1 };
    const designerSpy = jasmine.createSpy('createElement');
    sut.designer = { createElement: designerSpy };
    sut.formId = 'abc';

    dialogSpy.open.and.returnValue(dialogResult);

    await sut.renderElement({ builder: 'a' });

    expect(designerSpy).not.toHaveBeenCalled();
    done();
  });

  it('saves the template object', () => {
    sut.designer = { element: { innerHTML: 'a' } };
    sut.formId = 'abc';

    sut.saveTemplate();

    expect(storeSpy.dispatch.calls.argsFor(0)[0]).toEqual(editFormTemplate('a'));
  });

  it('unsubscribes on deactivate', () => {
    let unsubscribe = false;
    const subscription = () => unsubscribe = true;
    storeSpy.subscribe.and.returnValue(subscription);
    sut.activate({ form: 'a' });

    sut.deactivate();

    expect(unsubscribe).toBeTruthy();
  });
});
