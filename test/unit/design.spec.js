import './setup';
import * as typeSelectors from '../../src/domain/element-type/element-type-selectors';
import * as templateSelectors from '../../src/domain/template/template-selectors';
import { Design } from '../../src/design';
import { Store } from 'aurelia-redux-plugin';
import { DialogService } from 'aurelia-dialog';
import { Metadata } from '../../src/metadata';
import {
  TemplateActions,
  ElementTypeActions
} from '../../src/domain/index';

describe('the design view model', () => {
  let sut;
  let templateActionSpy;
  let elemTypeActionSpy;
  let templateSelectorSpy;
  let elemTypeSelectorSpy;
  let storeSpy
  let dialogSpy;

  beforeEach(() => {
    templateActionSpy = jasmine.setupSpy('templateAction', TemplateActions.prototype);
    elemTypeActionSpy = jasmine.setupSpy('elemTypeAction', ElementTypeActions.prototype);
    storeSpy = jasmine.setupSpy('store', Store.prototype);
    dialogSpy = jasmine.setupSpy('dialog', DialogService.prototype);
    templateSelectorSpy = spyOn(templateSelectors, 'getTemplate');
    elemTypeSelectorSpy = spyOn(typeSelectors, 'getElementTypes');
    sut = new Design(storeSpy, elemTypeActionSpy, dialogSpy, templateActionSpy);
  });

  it('instantiates properties to defaults', () => {
    expect(sut.elementTypes).toEqual([]);
    expect(sut.designer).toEqual({});
    expect(sut.builder).toEqual('');
    expect(sut.template).toEqual('');
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

  it('gets the template from the selector', async done => {
    const template = { };
    const state = {};

    storeSpy.getState.and.returnValue(state);
    templateSelectorSpy.and.returnValue(template)

    await sut.activate({ form: 'a' });

    expect(templateSelectorSpy.calls.argsFor(0)[0]).toBe(state)
    expect(sut.template).toEqual(template);
    done();
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
    sut.designer = { addElement: () => { } };
    const designerSpy = spyOn(sut.designer, 'addElement');
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
});
