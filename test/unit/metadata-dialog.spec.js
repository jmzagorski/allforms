import * as formSelectors from '../../src/domain/form/form-selectors';
import * as elemSelectors from '../../src/domain/element/element-selectors';
import * as creator from '../../src/elements/factory';
import { MetadataDialog } from '../../src/metadata-dialog';
import { Store } from 'aurelia-redux-plugin';
import { DialogController } from 'aurelia-dialog';
import { ElementActions } from '../../src/domain/index';
import { setupSpy } from './jasmine-helpers';

describe('the metadata dialog view model', () => {
  let sut;
  let elemActionSpy;
  let formSelectorSpy;
  let elemSelectorSpy;
  let storeSpy
  let dialogSpy;
  let creatorSpy;

  beforeEach(() => {
    elemActionSpy = setupSpy('elemAction', ElementActions.prototype);
    storeSpy = setupSpy('store', Store.prototype);
    dialogSpy = setupSpy('dialog', DialogController.prototype);
    formSelectorSpy = spyOn(formSelectors, 'getActiveForm');
    elemSelectorSpy = spyOn(elemSelectors, 'getActiveElement');
    creatorSpy = spyOn(creator, 'default');
    sut = new MetadataDialog(elemActionSpy, dialogSpy, storeSpy);

    formSelectorSpy.and.returnValue({ id: 'a', style: 'bootstrap' });
  });

  it('instantiates the view model', () => {
    expect(sut.newElement).toBeDefined();
    expect(sut.model).toBeDefined();
    expect(sut.schemas).toEqual([]);
  });

  it('creates a new element from the factory function', async done => {
    const model = { id: 1, type: 'ab' };
    const state = {};
    const element = { element: 2}
    storeSpy.getState.and.returnValue(state);
    formSelectorSpy.and.returnValue({ style: 'xx', id: 'test' });
    creatorSpy.and.returnValue({ schema: [] })
    elemSelectorSpy.and.returnValue(element);

    // make sure we load the element first!
    elemActionSpy.loadElement.and.callFake(() => {
      expect(elemSelectorSpy.calls.count()).toEqual(0);
    });

    await sut.activate(model);

    expect(formSelectorSpy).toHaveBeenCalledWith(state);
    expect(creatorSpy).toHaveBeenCalledWith('xx', 'ab');
    expect(elemActionSpy.loadElement).toHaveBeenCalledWith(1);
    expect(elemSelectorSpy).toHaveBeenCalledWith(state);
    expect(sut.model).toEqual({
      schema: [],
      id: 1,
      type: 'ab',
      element: 2
    });
    done();
  });

  it('pushes the relative path to the elements schema', async done => {
    creatorSpy.and.returnValue({ schema: ['view.html'] })

    await sut.activate({});

    expect(sut.schemas).toEqual([ './elements/views/view.html' ]);
    done();
  });

  it('submits the form data', async done => {
    const element = { a: 1 };
    sut.model = { b: 2 }
    sut.newElement = { c: 3}

    elemSelectorSpy.and.returnValue(element);

    await sut.submit();

    expect(elemActionSpy.saveElement.calls.argsFor(0)[0]).toBe(sut.model);
    expect(dialogSpy.ok.calls.argsFor(0)[0]).toEqual({ a: 1, b: 2, c: 3});
    done();
  });

  it('cancels the dialog', async done => {
    await sut.cancel();

    expect(dialogSpy.cancel).toHaveBeenCalled();
    done();
  });
});
