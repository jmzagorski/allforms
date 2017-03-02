import { ElementApi } from '../../../../src/api/element-api';
import { Store } from 'aurelia-redux-plugin';
import { ElementActions } from '../../../../src/domain/index';
import * as selectors from '../../../../src/domain/element/element-selectors';

describe('the element actions', () => {
  var sut;
  var storeSpy;
  var apiSpy;

  beforeEach(() => {
    storeSpy = jasmine.setupSpy('store', Store.prototype);
    apiSpy = jasmine.setupSpy('api', ElementApi.prototype);
    sut = new ElementActions(apiSpy, storeSpy);
  });

  it('loads the element by id for the form from the api', async done => {
    const element = {};

    spyOn(selectors, 'getElements').and.returnValue([]);
    apiSpy.get.and.returnValue(element);

    await sut.loadElement(1);

    expect(apiSpy.get).toHaveBeenCalledWith(1);
    expect(storeSpy.dispatch).toHaveBeenCalledWith({
      type: 'LOAD_ELEMENT_SUCCESS', element
    });
    expect(storeSpy.dispatch.calls.argsFor(0)[0].element).toBe(element);
    done();
  });

  it('loads the element from the store without calling the api', async done => {
    const element = { id: 1 };

    spyOn(selectors, 'getElements').and.returnValue([ element ]);

    await sut.loadElement(1);

    expect(apiSpy.get).not.toHaveBeenCalled();
    expect(storeSpy.dispatch.calls.argsFor(0)[0].element).toBe(element);
    done();
  });

  it('dispatches an element not found when there is no id', async done => {
    const selectSpy = spyOn(selectors, 'getElements');

    await sut.loadElement();

    expect(apiSpy.get).not.toHaveBeenCalled();
    expect(selectSpy).not.toHaveBeenCalled();
    expect(storeSpy.dispatch.calls.count()).toEqual(1);
    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      { type: 'ELEMENT_NOT_FOUND', payload: {} }
    );
    done();
  });

  using([
    { id: null, type: 'ADD_ELEMENT_SUCCESS'},
    { id: undefined, type: 'ADD_ELEMENT_SUCCESS'},
    { id: 0, type: 'ADD_ELEMENT_SUCCESS'},
    { id: 1, type: 'EDIT_ELEMENT_SUCCESS'}
  ], data => {
    it('adds the element if the ID is not available', async done => {
      const element = { id: data.id };
      const serverElem = { };

      apiSpy.save.and.returnValue(serverElem);

      await sut.saveElement(element);

      expect(apiSpy.save).toHaveBeenCalledWith(element);
      expect(storeSpy.dispatch).toHaveBeenCalledWith({
        type: data.type, element: serverElem
      });
      expect(storeSpy.dispatch.calls.argsFor(0)[0].element).toBe(serverElem);
      done();
    });
  });
});
