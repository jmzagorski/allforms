import * as typeSelectors from '../../src/domain/element-type/selectors';
import * as formSelectors from '../../src/domain/form/selectors';
import { Design } from '../../src/design';
import { Store } from 'aurelia-redux-plugin';
import { DialogService } from 'aurelia-dialog';
import { MetadataDialog } from '../../src/metadata-dialog';
import {
  requestForm,
  requestElementTypes,
  editFormTemplate,
  deleteElement
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
    expect(sut.formId).toEqual(null);
    expect(sut.style).toEqual(null);
    expect(sut.api).toEqual(null);
    expect(sut.html).toEqual('');
    expect(sut.interactOptions).toBeDefined();
    expect(sut.interactOptions.dragOptions).toBeDefined();
    expect(sut.interactOptions.dragOptions.restriction).toEqual('#page-host');
    expect(sut.interactOptions.dragOptions.enabled).toBeTruthy();
    expect(sut.interactOptions.resize).toBeFalsy();
  });

  it('gets the element types as a readonly property', () => {
    const state = {};
    const types = [];

    storeSpy.getState.and.returnValue(state);
    elemTypeSelectorSpy.and.returnValue(types)

    const elemTypes = sut.elementTypes;

    expect(elemTypeSelectorSpy.calls.argsFor(0)[0]).toBe(state)
    expect(sut.elementTypes).toBe(types);
  });

  it('dispatches a request for the element types', () => {
    storeSpy.subscribe.and.callFake(() => {
      expect(storeSpy.dispatch).not.toHaveBeenCalled()
    });

    sut.activate({});

    expect(storeSpy.dispatch).toHaveBeenCalledWith(requestElementTypes());
  });

  it('subscribes to the store on activate', () => {
    sut.activate({ });

    expect(storeSpy.subscribe.calls.count()).toEqual(1);
  });

  it('saves the new layout when dialog is not cancelled', async done => {
    const dialogResult = {
      wasCancelled: false,
      output: { outerHTML: 'elem html', id: '2' }
    };
    sut.style = 'c';
    sut.formId = 'd';
    sut.html = 'existing'

    const expectDialogModel = {
      builder: 'a', style: sut.style, formId: sut.formId
    };

    dialogSpy.open.and.returnValue(dialogResult);

    await sut.createMetadata({ builder: 'a' });

    expect(dialogSpy.open).toHaveBeenCalledWith({
      viewModel: MetadataDialog,
      model: expectDialogModel
    });
    expect(storeSpy.dispatch.calls.argsFor(0)[0]).toEqual(editFormTemplate({
      form: {
        template: 'existingelem html',
        id: sut.formId
      },
      element: {
        template: 'elem html',
        id: '2'
      }
    }));
    expect(storeSpy.dispatch.calls.argsFor(1)[0]).toEqual(
      requestForm(sut.formId)
    );
    done();
  });

  it('creates the metadata from a interact dblclick event', async done => {
    const $elem = { id: '2', outerHTML: 'elem html' };
    const event = {
      detail: {
        $form: { outerHTML: 'formHtml' },
        type: 'dblclick',
        $elem
      }
    }
    const dialogResult = {
      wasCancelled: false,
      output: $elem
    };
    sut.style = 'c';
    sut.formId = 'd';
    sut.html = 'should not be saved';

    const expectDialogModel = {
      $elem, formId: sut.formId, style: sut.style, $form: event.detail.$form
    };

    dialogSpy.open.and.returnValue(dialogResult);

    await sut.saveInteraction(event);

    expect(dialogSpy.open).toHaveBeenCalledWith({
      viewModel: MetadataDialog,
      model: expectDialogModel
    });
    expect(storeSpy.dispatch.calls.argsFor(0)[0]).toEqual(editFormTemplate({
      form: {
        template: 'formHtml',
        id: sut.formId
      },
      element: {
        template: 'elem html',
        id: '2'
      }
    }));
    expect(storeSpy.dispatch.calls.argsFor(1)[0]).toEqual(
      requestForm(sut.formId)
    );
    done();
  });

  it('deletes the element on delete', async done => {
    const $elem = { id: '2' };
    const event = {
      detail: {
        $form: { outerHTML: 'formHtml' },
        type: 'delete',
        $elem
      }
    }
    await sut.saveInteraction(event);

    expect(storeSpy.dispatch.calls.count()).toEqual(2);
    expect(storeSpy.dispatch.calls.argsFor(0)[0]).toEqual(deleteElement('2'))
    expect(storeSpy.dispatch.calls.argsFor(1)[0]).toEqual(editFormTemplate({
      form: {
        template: 'formHtml',
        id: sut.formId
      },
    }));
    done();
  });

  it('saves the layout on any other interaction', async done => {
    const $elem = { id: '2', outerHTML: 'elem html' };
    const event = {
      detail: {
        $form: { outerHTML: 'formHtml' },
        type: '???',
        $elem
      }
    }
    sut.formId = 'a';

    await sut.saveInteraction(event);

    expect(storeSpy.dispatch.calls.argsFor(0)[0]).toEqual(editFormTemplate({
      form: {
        template: 'formHtml',
        id: sut.formId
      },
      element: {
        template: 'elem html',
        id: '2'
      }
    }));
    expect(storeSpy.dispatch.calls.argsFor(1)[0]).toEqual(
      requestForm(sut.formId)
    );
    done();
  });

  it('does not create the element if dialog cancelled', async done => {
    const dialogResult = { wasCancelled: true, output: 1 };

    dialogSpy.open.and.returnValue(dialogResult);

    await sut.createMetadata({});

    expect(storeSpy.dispatch).not.toHaveBeenCalled();
    done();
  });

  it('unsubscribes on deactivate', () => {
    let unsubscribe = false;
    const subscription = () => unsubscribe = true;
    storeSpy.subscribe.and.returnValue(subscription);
    sut.activate({ });

    sut.deactivate();

    expect(unsubscribe).toBeTruthy();
  });

  [ { template: null, expect: 'a' },
    { template: undefined, expect: 'a' },
    { template: '', expect: 'a' },
    { template: 'b', expect: 'b' },
  ].forEach(data => {
    it('updates the view model properties on update', () => {
      const state = {};
      const form = { template: data.template, style: 'a', id: 1, api: '/' };
      let updateFunc = null;

      sut.html = 'a'

      storeSpy.getState.and.returnValue(state);
      storeSpy.subscribe.and.callFake(func => updateFunc = func);
      formSelectorSpy.and.returnValue(form)

      sut.activate({ });
      updateFunc();

      expect(formSelectorSpy.calls.argsFor(0)[0]).toBe(state)
      expect(sut.formId).toEqual(form.id);
      expect(sut.style).toEqual(form.style);
      expect(sut.api).toEqual(form.api);
      expect(sut.html).toEqual(data.expect);
    });
  });

  it('does not update the view model properties without a form', () => {
    let updateFunc = null;

    formSelectorSpy.and.returnValue(null);
    storeSpy.subscribe.and.callFake(func => updateFunc = func);
    sut.activate({});

    updateFunc();

    expect(sut.style).toEqual(null);
    expect(sut.formId).toEqual(null);
    expect(sut.api).toEqual(null);
    expect(sut.html).toEqual('');
  });
});
