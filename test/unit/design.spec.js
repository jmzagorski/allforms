import './setup';
import * as typeSelectors from '../../src/domain/element-type/element-type-selectors';
import * as templateSelectors from '../../src/domain/template/template-selectors';
import * as formSelectors from '../../src/domain/form/form-selectors';
import { Design } from '../../src/design';
import { Store } from 'aurelia-redux-plugin';
import { DialogService } from 'aurelia-dialog';
import { Metadata } from '../../src/metadata';
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

    formSelectorSpy.and.returnValue({ style: '', name: 'abc' });
  });

  it('instantiates properties to defaults', () => {
    expect(sut.elementTypes).toEqual([]);
    expect(sut.designer).toEqual({});
    expect(sut.builder).toEqual('');
    expect(sut.template).toEqual({ name: null, html: '' });
    expect(sut.style).toEqual(null);
  });

  it('loads the template before the state is retrieved', async done => {
    // make sure the loading is before the state calling
    templateActionSpy.loadTemplateFor.and.callFake(() => {
      expect(storeSpy.getState.calls.count()).toEqual(0);
    });

    await sut.activate({ form: 'a' });

    expect(templateActionSpy.loadTemplateFor).toHaveBeenCalledWith('a');
    expect(storeSpy.getState.calls.count()).toEqual(1);
    done();
  });

  it('loads the element types before the state is retrieved', async done => {
    // make sure the loading is before the state calling
    elemTypeActionSpy.loadAll.and.callFake(() => {
      expect(storeSpy.getState.calls.count()).toEqual(0);
    });

    await sut.activate({ form: 'a' });

    expect(elemTypeActionSpy.loadAll).toHaveBeenCalled();
    expect(storeSpy.getState.calls.count()).toEqual(1);
    done();
  });

  using([
    { template: undefined, expect: { name: null, html: '' } },
    { template: { name: 'a' }, expect: { name: 'a' } }
  ], data => {
    it('gets the template from the selector', async done => {
      const state = {};

      storeSpy.getState.and.returnValue(state);
      templateSelectorSpy.and.returnValue(data.template)

      await sut.activate({ form: 'a' });

      expect(templateSelectorSpy.calls.argsFor(0)[0]).toBe(state)
      expect(sut.template).toEqual(data.expect);
      done();
    });
  });

  it('gets the element types from the selector', async done => {
    const state = {}
    const types = [];

    storeSpy.getState.and.returnValue(state);
    elemTypeSelectorSpy.and.returnValue(types)

    await sut.activate({ form: 'a' });

    expect(elemTypeSelectorSpy.calls.argsFor(0)[0]).toBe(state)
    expect(sut.elementTypes).toBe(types);
    done();
  });

  it('gets the form style from the active form', async done => {
    const state = {}

    storeSpy.getState.and.returnValue(state);
    formSelectorSpy.and.returnValue({ style: 'b' });

    await sut.activate({ form: 'a' });

    expect(formSelectorSpy.calls.argsFor(0)[0]).toBe(state)
    expect(sut.style).toBe('b');
    done();
  });

  it('resets the builder property after rendering', async done => {
    const dialogResult = { wasCancelled: true };
    sut.builder = 'a';
    dialogSpy.open.and.returnValue(dialogResult);

    await sut.renderElement();

    expect(sut.builder).toEqual('');
    done();
  });

  it('adds the element to the designer if dialog not cancelled', async done => {
    const dialogResult = { wasCancelled: false, output: 1 };
    sut.designer = { createElement: () => { } };
    const designerSpy = spyOn(sut.designer, 'createElement');
    dialogSpy.open.and.returnValue(dialogResult);
    sut.builder = 'a';

    await sut.renderElement();

    expect(designerSpy).toHaveBeenCalledWith({
      type: 'a',
      options: 1
    });
    done();
  });

  it('calls the dialog service open method to setup metadata', () => {
    const model = {};
    const event = { detail: { model } };

    sut.setupMetadata(event);

    expect(dialogSpy.open).toHaveBeenCalledWith({
      viewModel: Metadata, model
    });
  });

  it('saves the template ojbject', async done => {
    sut.designer = { element: { innerHTML: 'a' } };
    await sut.activate({ form: 'a' });

    sut.saveTemplate();

    expect(sut.template.name).toEqual('abc');
    expect(sut.template.html).toEqual('a');
    expect(templateActionSpy.save.calls.argsFor(0)[0]).toBe(sut.template);
    done();
  });
});
