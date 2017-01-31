import { ElementApi } from '../../../../src/api/element-api';
import { Store } from 'aurelia-redux-plugin';
import { ElementActions } from '../../../../src/domain/index';

describe('the element actions', () => {
  var sut;
  var storeSpy;
  var apiSpy;

  beforeEach(() => {
    storeSpy = jasmine.setupSpy('store', Store.prototype);
    apiSpy = jasmine.setupSpy('api', ElementApi.prototype);
    sut = new ElementActions(apiSpy, storeSpy);
  });

  it('loads the elements from the form name', async done => {
    const elements = [];

    apiSpy.getAllFor.and.returnValue(elements);

    await sut.loadElements('anythin');

    expect(apiSpy.getAllFor).toHaveBeenCalledWith('anythin');
    expect(storeSpy.dispatch).toHaveBeenCalledWith({
      type: 'LOAD_ELEMENTS_SUCCESS', elements
    });
    expect(storeSpy.dispatch.calls.argsFor(0)[0].elements).toBe(elements);
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
