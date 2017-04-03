import * as formSelectors from '../../src/domain/form/selectors';
import * as elemSelectors from '../../src/domain/element/selectors';
import * as creator from '../../src/elements/factory';
import {
  defaultNewElement,
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

    // default so tests don't error, if an element cannot be made, error
    // should be thrown in factory iteself
    creatorSpy.and.returnValue({ schema: [] })
  });

  it('instantiates the view model', () => {
    expect(sut.model).toBeDefined();
    expect(sut.schemas).toEqual([]);
  });

  it('gets the element as a readonly property', () => {
    const state = {};
    const expected = {};

    storeSpy.getState.and.returnValue(state);
    elemSelectorSpy.and.returnValue(expected)

    const actual = sut.element;

    expect(elemSelectorSpy.calls.argsFor(0)[0]).toBe(state)
    expect(actual).toBe(expected);
  });

  it('creates the model from the creator and the passed in event', () => {
    const event = { formId: 3, id: 1, $elem: 'ab', builder: 'a', style: 'xx' };
    const state = {};
    storeSpy.getState.and.returnValue(state);

    sut.activate(event);

    expect(creatorSpy).toHaveBeenCalledWith('xx', 'a');
    expect(sut.model).toEqual({
      schema: [],
      formId: 3,
      id: 1,
      $elem: 'ab',
      builder: 'a',
      style: 'xx'
    });
  });

  it('pushes the relative path to the elements schema', () => {
    creatorSpy.and.returnValue({ schema: ['view.html'] })

    sut.activate({});

    expect(sut.schemas).toEqual([ './elements/views/view.html' ]);
  });

  it('subscribes before dispatches on activate', () => {
    storeSpy.subscribe.and.callFake(() => {
      expect(storeSpy.dispatch).not.toHaveBeenCalled();
    });

    sut.activate({ $elem: { id: 1 }});

    expect(storeSpy.subscribe.calls.count()).toEqual(1);
    expect(storeSpy.dispatch.calls.argsFor(0)).toEqual([defaultNewElement(sut.model)]);
    expect(storeSpy.dispatch.calls.argsFor(1)).toEqual([requestElement(1)]);
  });

  it('does not dispatch if no existing element', () => {
    sut.activate({ });

    expect(storeSpy.dispatch).not.toHaveBeenCalledWith();
  });

  [ { element: { name: 'a' }, expected: { name: 'a' } },
    { element: { bb: 'a' }, expected: { bb: 'a', name: 'b' } },
    { element: null, expected: { name: 'b' } },
    { element: undefined, expected: { name: 'b' } }
  ].forEach(data => {
    it('adds the element properties on subscription update', () => {
      let update = null;
      creatorSpy.and.returnValue({ formId: 3, schema: [], id: 1, name: 'b' });
      storeSpy.subscribe.and.callFake(func => update = func);
      elemSelectorSpy.and.returnValue(data.element);
      data.expected.id = 1;
      data.expected.schema = [];
      data.expected.formId = 3;

      sut.activate({ formId: 3 });
      update();

      expect(sut.model).toEqual(data.expected);
    });
  });

  [ { $elem: null, creator: createElement, func: 'create' },
    { $elem: {}, creator: editElement, func: 'mutate' },
    { $elem: {}, creator: editElement, func: 'create' }
  ].forEach(data => {
    it('dispatches an action creator on submit', () => {
      const creatorSpy = jasmine.createSpy('creatorFunc');
      sut.model.$elem = data.$elem;
      sut.model[data.func] = creatorSpy;
      const expectAction = data.creator(sut.model);

      sut.submit();

      expect(storeSpy.dispatch).toHaveBeenCalledWith(expectAction)
      expect(creatorSpy.calls.argsFor(0)[0]).toEqual(data.$elem || undefined);
    });
  });

  [ null, undefined, { id: null }, { id: undefined }, { id: '' }
  ].forEach(element => {
    it('does not call the dialog when element is not ready', async done => {
      let okFunc = null
      sut.model = { id: 1 }
      sut.model.create = () => {};

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

    sut.model.create = () => { return { a: 3 }; }

    elemSelectorSpy.and.returnValue(element);
    storeSpy.subscribe.and.callFake(func => okFunc = func);

    sut.submit();
    await okFunc();

    expect(dialogSpy.ok).toHaveBeenCalledWith({
      id: 2, a: 3
    });
    done();
  });

  it('cancels the dialog', async done => {
    await sut.cancel();

    expect(dialogSpy.cancel).toHaveBeenCalled();
    done();
  });

  it('unsubscribes from the store on deactivate', () => {
    let subscriptions = 0;
    const func = () => subscriptions++
    creatorSpy.and.returnValue({ schema: [], create: () => {} });
    storeSpy.subscribe.and.returnValue(func);

    sut.activate({});
    sut.submit();

    sut.deactivate();

    expect(subscriptions).toEqual(2);
  });
});
