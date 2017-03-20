import * as formSelectors from '../../src/domain/form/form-selectors';
import * as elemSelectors from '../../src/domain/element/selectors';
import * as creator from '../../src/elements/factory';
import {
  requestElement,
  createElement,
  creatingElement,
  editElement
} from '../../src/domain/element/actions';
import { MetadataDialog } from '../../src/metadata-dialog';
import { Store } from 'aurelia-redux-plugin';
import { DialogController } from 'aurelia-dialog';
import { setupSpy } from './jasmine-helpers';

describe('the metadata dialog view model', () => {
  let sut;
  let formSelectorSpy;
  let elemSelectorSpy;
  let storeSpy
  let dialogSpy;
  let creatorSpy;

  beforeEach(() => {
    storeSpy = setupSpy('store', Store.prototype);
    dialogSpy = setupSpy('dialog', DialogController.prototype);
    formSelectorSpy = spyOn(formSelectors, 'getActiveForm');
    elemSelectorSpy = spyOn(elemSelectors, 'getActiveElement');
    creatorSpy = spyOn(creator, 'default');
    sut = new MetadataDialog(dialogSpy, storeSpy);

    formSelectorSpy.and.returnValue({ id: 'a', style: 'bootstrap' });
  });

  it('instantiates the view model', () => {
    expect(sut.model).toBeDefined();
    expect(sut.schemas).toEqual([]);
    expect(sut.isNew).toBeFalsy();
  });

  it('gets the active form from the state and adds the form id to the model', () => {
    const model = { id: 1, type: 'ab' };
    const state = {};
    storeSpy.getState.and.returnValue(state);
    formSelectorSpy.and.returnValue({ style: 'xx', id: 'test' });
    creatorSpy.and.returnValue({ schema: [] })

    sut.activate(model);

    expect(formSelectorSpy).toHaveBeenCalledWith(state);
    expect(creatorSpy).toHaveBeenCalledWith('xx', 'ab');
    expect(sut.model.formId).toEqual('test');
  });

  it('pushes the relative path to the elements schema', () => {
    creatorSpy.and.returnValue({ schema: ['view.html'] })

    sut.activate({});

    expect(sut.schemas).toEqual([ './elements/views/view.html' ]);
  });

  it('reinitializes an element from the factory', () => {
    const model = { id: 1 };
    const state = {};
    const element = { cd: 2 }
    storeSpy.getState.and.returnValue(state);
    formSelectorSpy.and.returnValue({ id: 'test' });
    creatorSpy.and.returnValue({ schema: [] })
    elemSelectorSpy.and.returnValue(element);

    sut.activate(model);

    expect(storeSpy.dispatch.calls.count()).toEqual(1);
    expect(storeSpy.dispatch).toHaveBeenCalledWith(requestElement(model.id));
    expect(elemSelectorSpy).toHaveBeenCalledWith(state);
    expect(sut.model).toEqual({
      schema: [], formId: 'test', id: 1, cd: 2
    });
  });

  it('initializes the model to create a new element', () => {
    const model = { type: 'a' };
    const expectModel = {
      schema: [], formId: 'test', type: 'a'
    };
    formSelectorSpy.and.returnValue({ id: 'test' });
    creatorSpy.and.returnValue({ schema: [] })

    sut.activate(model);

    expect(storeSpy.dispatch.calls.count()).toEqual(1);
    expect(storeSpy.dispatch).toHaveBeenCalledWith(creatingElement(expectModel));
    expect(elemSelectorSpy).not.toHaveBeenCalled();
    expect(sut.model).toEqual(expectModel);
  });

  [ { isNew: true, creator: createElement },
    { isNew: false, creator: editElement }
  ].forEach(data => {
    it('dispatches an action creator on submit', () => {
      sut.isNew = data.isNew;
      sut.model = { id: 1 }
      const expectAction = data.creator(sut.model);

      sut.submit();

      expect(storeSpy.dispatch).toHaveBeenCalledWith(expectAction)
    });
  });

  [ null, undefined, { id: null }, { id: undefined }, { id: '' }
  ].forEach(element => {
    it('does not call the dialog when element is not ready', async done => {
      let okFunc = null
      sut.model = { id: 1 }

      elemSelectorSpy.and.returnValue(element);
      storeSpy.subscribe.and.callFake(func => okFunc = func);

      sut.submit();

      await okFunc();

      expect(dialogSpy.ok).not.toHaveBeenCalled();
      done();
    });
  });

  it('calls the dialog when element is ready', async done => {
    const element = { id: 2 }
    let okFunc = null;
    sut.model = { a: 1 }

    elemSelectorSpy.and.returnValue(element);
    storeSpy.subscribe.and.callFake(func => okFunc = func);

    sut.submit();
    await okFunc();

    expect(dialogSpy.ok).toHaveBeenCalledWith({
      id: 2, a: 1
    });
    done();
  });

  it('cancels the dialog', async done => {
    await sut.cancel();

    expect(dialogSpy.cancel).toHaveBeenCalled();
    done();
  });

  it('unsubscribes from the store on deactivate', () => {
    let unsubscribe = false;
    const func = () => unsubscribe = true; 
    storeSpy.subscribe.and.returnValue(func);
    sut.submit();

    sut.deactivate();

    expect(unsubscribe).toBeTruthy();
  });
});
