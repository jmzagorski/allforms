import './setup';
import * as typeSelectors from '../../src/domain/element-type/element-type-selectors';
import * as templateSelectors from '../../src/domain/template/template-selectors';
import * as formSelectors from '../../src/domain/form/form-selectors';
import { Design } from '../../src/design';
import { Store } from 'aurelia-redux-plugin';
import { DialogService } from 'aurelia-dialog';
import { MetadataDialog } from '../../src/metadata-dialog';
import {
  TemplateActions,
  ElementTypeActions
} from '../../src/domain/index';
import using from 'jasmine-data-provider';

describe('the design view model', () => {
  let sut;
  let templateActionSpy;
  let elemTypeActionSpy;
  let templateSelectorSpy;
  let elemTypeSelectorSpy;
  let formSelectorSpy;
  let storeSpy
  let dialogSpy;

  beforeEach(() => {
    templateActionSpy = jasmine.setupSpy('templateAction', TemplateActions.prototype);
    elemTypeActionSpy = jasmine.setupSpy('elemTypeAction', ElementTypeActions.prototype);
    storeSpy = jasmine.setupSpy('store', Store.prototype);
    dialogSpy = jasmine.setupSpy('dialog', DialogService.prototype);
    templateSelectorSpy = spyOn(templateSelectors, 'getTemplate');
    elemTypeSelectorSpy = spyOn(typeSelectors, 'getElementTypes');
    formSelectorSpy = spyOn(formSelectors, 'getActiveForm');
    sut = new Design(storeSpy, elemTypeActionSpy, dialogSpy, templateActionSpy);

    formSelectorSpy.and.returnValue({ style: '', id: 'abc' });
    templateSelectorSpy.and.returnValue({ html: '' });
  });

  it('instantiates properties to defaults', () => {
    expect(sut.html).toEqual('');
    expect(sut.style).toEqual(null);
    expect(sut.designer).toEqual({});
    expect(sut.interactable).toEqual('drag');
  });

  it('loads the template data during activate', async done => {
    // make sure the loading is before the state calling
    templateActionSpy.loadTemplateFor.and.callFake(() => {
      expect(storeSpy.getState.calls.count()).toEqual(0);
    });

    await sut.activate({ form: 'a' });

    expect(templateActionSpy.loadTemplateFor).toHaveBeenCalledWith('a');
    done();
  });

  it('loads the element types during activate', async done => {
    // make sure the loading is before the state calling
    elemTypeActionSpy.loadAll.and.callFake(() => {
      expect(storeSpy.getState.calls.count()).toEqual(0);
    });

    await sut.activate({ form: 'a' });

    expect(elemTypeActionSpy.loadAll).toHaveBeenCalled();
    done();
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

  using([
    { template: {}, expect: { id: null, html: '' } },
    { template: { id: 'a', html: 'b' }, expect: { id: 'a', html: 'b' } }
  ], data => {
    it('gets the template from the selector', async done => {
      const state = {};

      storeSpy.getState.and.returnValue(state);
      templateSelectorSpy.and.returnValue(data.template)

      await sut.activate({ form: 'a' });

      expect(templateSelectorSpy.calls.argsFor(0)[0]).toBe(state)
      expect(sut.html).toEqual(data.expect.html);
      done();
    });
  });

  it('gets the form properties from the active form', async done => {
    const state = {}

    storeSpy.getState.and.returnValue(state);
    formSelectorSpy.and.returnValue({ id: 1, style: 'b' });

    await sut.activate({ form: 'a' });

    expect(formSelectorSpy.calls.argsFor(0)[0]).toBe(state)
    expect(sut.style).toBe('b');
    done();
  });

  it('calls to create the element if dialog not cancelled', async done => {
    const dialogResult = { wasCancelled: false, output: {} };
    sut.designer = { createElement: () => { } };
    sut.designer.element = { innerHTML: 'html' };
    const designerSpy = spyOn(sut.designer, 'createElement');
    dialogSpy.open.and.returnValue(dialogResult);
    designerSpy.and.callFake(() => {
      expect(templateActionSpy.save.calls.count()).toEqual(0);
    });
    // call this so the private _formId is set
    await sut.activate({ form: 'a' });

    await sut.renderElement({ builder: 'a' });

    expect(dialogSpy.open).toHaveBeenCalledWith({
      viewModel: MetadataDialog,
      model: { type: 'a' }
    });
    expect(designerSpy.calls.argsFor(0)[0]).toBe(dialogResult.output);
    expect(templateActionSpy.save.calls.count()).toEqual(1);
    expect(templateActionSpy.save).toHaveBeenCalledWith({
      id: 'abc',
      html: 'html'
    })
    done();
  });

  it('does not create the element if dialog is cancelled', async done => {
    const dialogResult = { wasCancelled: true, output: 1 };

    sut.designer = { createElement: () => { } };
    const designerSpy = spyOn(sut.designer, 'createElement');

    dialogSpy.open.and.returnValue(dialogResult);

    await sut.renderElement({ builder: 'a' });

    expect(designerSpy).not.toHaveBeenCalled();
    expect(templateActionSpy.save).not.toHaveBeenCalled();
    done();
  });

  it('saves the template ojbject', async done => {
    sut.designer = { element: { innerHTML: 'a' } };
    await sut.activate({ form: 'a' });

    sut.saveTemplate();

    expect(templateActionSpy.save.calls.argsFor(0)[0]).toEqual({
      id: 'abc', html: 'a'
    });
    done();
  });
});
