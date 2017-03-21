import * as typeSelectors from '../../src/domain/element-type/selectors';
import * as templateSelectors from '../../src/domain/template/selectors';
import * as formSelectors from '../../src/domain/form/selectors';
import { Design } from '../../src/design';
import { Store } from 'aurelia-redux-plugin';
import { DialogService } from 'aurelia-dialog';
import { MetadataDialog } from '../../src/metadata-dialog';
import {
  requestTemplate,
  requestElementTypes,
  createTemplate,
  editTemplate
} from '../../src/domain/index';
import { setupSpy } from './jasmine-helpers';
import using from 'jasmine-data-provider';

describe('the design view model', () => {
  let sut;
  let templateSelectorSpy;
  let elemTypeSelectorSpy;
  let formSelectorSpy;
  let storeSpy
  let dialogSpy;

  beforeEach(() => {
    storeSpy = setupSpy('store', Store.prototype);
    dialogSpy = setupSpy('dialog', DialogService.prototype);
    templateSelectorSpy = spyOn(templateSelectors, 'getTemplate');
    elemTypeSelectorSpy = spyOn(typeSelectors, 'getElementTypes');
    formSelectorSpy = spyOn(formSelectors, 'getActiveForm');
    sut = new Design(storeSpy, dialogSpy);

    formSelectorSpy.and.returnValue({ style: '', id: 'abc' });
    templateSelectorSpy.and.returnValue({ html: '' });
  });

  it('instantiates properties to defaults', () => {
    expect(sut.html).toEqual('');
    expect(sut.style).toEqual(null);
    expect(sut.designer).toEqual({});
    expect(sut.interactable).toEqual('drag');
  });

  it('dispatches to get the template', () => {
    sut.activate({ form: 'a' });

    expect(storeSpy.dispatch).toHaveBeenCalledWith(requestTemplate('a'));
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

  using([
    { template: null, expect: { id: null, html: '' } },
    { template: undefined, expect: { id: null, html: '' } },
    { template: { id: 'a', html: 'b' }, expect: { id: 'a', html: 'b' } }
  ], data => {
    it('gets the template from the selector', () => {
      const state = {};

      storeSpy.getState.and.returnValue(state);
      templateSelectorSpy.and.returnValue(data.template)

      sut.activate({ form: 'a' });

      expect(templateSelectorSpy.calls.argsFor(0)[0]).toBe(state)
      expect(sut.html).toEqual(data.expect.html);
    });
  });

  it('gets the form properties from the active form', () => {
    const state = {}

    storeSpy.getState.and.returnValue(state);
    formSelectorSpy.and.returnValue({ id: 1, style: 'b' });

    sut.activate({ form: 'a' });

    expect(formSelectorSpy.calls.argsFor(0)[0]).toBe(state)
    expect(sut.style).toEqual('b');
    expect(sut.formId).toEqual(1)
  });

  it('renders the element when dialog is ok', async done => {
    const dialogResult = { wasCancelled: false, output: {} };
    const designerSpy = jasmine.createSpy('createElement');

    sut.designer = {
      createElement: designerSpy,
      element:  { innerHTML: 'html' }
    };

    dialogSpy.open.and.returnValue(dialogResult);

    await sut.renderElement({ builder: 'a' });

    expect(dialogSpy.open).toHaveBeenCalledWith({
      viewModel: MetadataDialog,
      model: { type: 'a' }
    });
    expect(designerSpy.calls.argsFor(0)[0]).toBe(dialogResult.output);
    done();
  });

  [ { template: null, creator: createTemplate },
    { template: undefined, creator: createTemplate },
    { template: {}, creator: editTemplate }
  ].forEach(data => {
    it('saves the template when dialog is ok', async done => {
      const dialogResult = { wasCancelled: false, output: {} };
      const designerSpy = jasmine.createSpy('createElement');
      sut.formId = 'abc';

      sut.designer = {
        createElement: designerSpy,
        element:  { innerHTML: 'html' }
      };

      templateSelectorSpy.and.returnValue(data.template);
      dialogSpy.open.and.returnValue(dialogResult);
      designerSpy.and.callFake(() => {
        expect(storeSpy.dispatch.calls.count()).toEqual(0);
      });

      await sut.renderElement({ builder: 'a' });

      expect(storeSpy.dispatch.calls.count()).toEqual(1);
      expect(storeSpy.dispatch.calls.argsFor(0)[0]).toEqual(data.creator(
        { id: 'abc', html: 'html' }
      ));
      done();
    });
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

  [ { template: null, creator: createTemplate },
    { template: undefined, creator: createTemplate },
    { template: {}, creator: editTemplate }
  ].forEach(data => {
    it('saves the template object', () => {
      sut.designer = { element: { innerHTML: 'a' } };
      sut.formId = 'abc';

      templateSelectorSpy.and.returnValue(data.template);

      sut.saveTemplate();

      expect(storeSpy.dispatch.calls.argsFor(0)[0]).toEqual(data.creator(
        { id: 'abc', html: 'a' }
      ));
    });
  });
});
