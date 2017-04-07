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

describe('the element metadata dialog view model', () => {
  let sut;
  let elemSelectorSpy;
  let storeSpy
  let dialogSpy;
  let creatorSpy;

  beforeEach(() => {
    storeSpy = setupSpy('store', Store.prototype);
    dialogSpy = setupSpy('dialog', DialogController.prototype);
    elemSelectorSpy = spyOn(elemSelectors, 'getActiveElement');
    creatorSpy = spyOn(creator, 'default');
    sut = new MetadataDialog(dialogSpy, storeSpy);

    // default so tests don't error, if an element cannot be made, error
    // should be thrown in factory iteself
    creatorSpy.and.returnValue({ schema: [] })
  });

  it('instantiates the view model', () => {
    expect(sut.model).toBeDefined();
    expect(sut.schemas).toEqual([]);
  });

  it('sets up the defaults on a new model', () => {
    const event = { formId: 3, builder: 'a', style: 'xx' };
    const state = {};

    creatorSpy.and.returnValue({ schema: ['view'] })

    sut.activate(event);

    expect(creatorSpy).toHaveBeenCalledWith('xx', 'a');
    expect(storeSpy.dispatch).toHaveBeenCalledWith(defaultNewElement(sut.model));
    expect(storeSpy.dispatch.calls.count()).toEqual(1);
    expect(storeSpy.subscribe).not.toHaveBeenCalledWith();
    expect(storeSpy.getState).not.toHaveBeenCalled();
    expect(sut.schemas.length).toEqual(1);
    expect(sut.schemas[0]).toEqual('./elements/views/view');
    expect(sut.model).toEqual({
      schema: ['view'],
      formId: 3,
      builder: 'a',
      style: 'xx'
    });
  });

  it('sets up the defaults on a existing model', () => {
    const event = { $elem: { id: 1 } };

    storeSpy.subscribe.and.callFake(() => {
      expect(storeSpy.dispatch.calls.count()).toEqual(0);
    });

    sut.activate(event);

    expect(sut.model).toEqual({ id: 1 });
    expect(sut.schemas).toEqual([]);
    expect(creatorSpy).not.toHaveBeenCalledWith();
    expect(storeSpy.dispatch.calls.count()).toEqual(1);
    expect(storeSpy.dispatch.calls.argsFor(0)).toEqual([requestElement(1)]);
    expect(storeSpy.subscribe.calls.count()).toEqual(1);
    expect(storeSpy.getState).not.toHaveBeenCalled();
  });

  [ { element: { id: 1, name: 'a' }, expected: { id: 1, schema: ['view.html'], name: 'a' } },
    { element: { id: 1, bb: 'a' }, expected: { id: 1, schema: ['view.html'], bb: 'a', name: 'b' } },
    { element: { id: 3 }, expected: { id: 1 } },
    { element: null, expected: { id: 1 } },
    { element: undefined, expected: { id: 1 } }
  ].forEach(data => {
    it('adds the element properties on subscription update when ids match', () => {
      let update = null;
      creatorSpy.and.returnValue({ schema: ['view.html'], name: 'b' });
      storeSpy.subscribe.and.callFake(func => update = func);
      elemSelectorSpy.and.returnValue(data.element);

      sut.activate({ $elem: { id: 1 } });
      update();

      expect(sut.model).toEqual(data.expected);
    });
  });

  it('clears the schemas on ever update', () => {
    let update = null;
    creatorSpy.and.returnValue({ schema: ['view.html'], });
    storeSpy.subscribe.and.callFake(func => update = func);
    elemSelectorSpy.and.returnValue({ id: 1 });

    sut.activate({ $elem: { id: 1 } });
    update();
    update();

    expect(sut.schemas).toEqual([ './elements/views/view.html' ]);
  });

  [ { $elem: null, id: null, creator: createElement },
    { $elem: null, id: undefined, creator: createElement },
    { $elem: null, id: 0, creator: createElement },
    { $elem: {}, id: 1, creator: editElement }
  ].forEach(data => {
    it('dispatches an action creator on submit', () => {
      const creatorSpy = jasmine.createSpy('creatorFunc');
      // activate to set the private _$elem
      sut.activate({ $elem: data.$elem })
      sut.model.create = creatorSpy;
      sut.model.id = data.id
      const expectAction = data.creator(sut.model);

      sut.submit();

      expect(storeSpy.dispatch.calls.mostRecent().args).toEqual([expectAction])
      expect(creatorSpy.calls.argsFor(0)[0]).toEqual(data.$elem);
    });
  });

  [ null, undefined, { id: null }, { id: undefined }, { id: '' } ].forEach(element => {
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

  [ { $elem: { id: null }, count: 2}, { count: 1} ].forEach(data => {
    it('unsubscribes from the store on deactivate', () => {
      let subscriptions = 0;
      const func = () => subscriptions++
      storeSpy.subscribe.and.returnValue(func);

      sut.activate({ $elem: data.$elem });
      sut.model.create = () => {}
      sut.submit();

      sut.deactivate();

      expect(subscriptions).toEqual(data.count);
    });
  });
});
