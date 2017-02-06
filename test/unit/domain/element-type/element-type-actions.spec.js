import { ElementTypeApi } from '../../../../src/api/element-type-api';
import { ElementTypeActions } from '../../../../src/domain/index';
import { Store } from 'aurelia-redux-plugin';

describe('the element type actions', () => {
  var sut;
  var storeSpy;
  var apiSpy;

  beforeEach(() => {
    storeSpy = jasmine.setupSpy('store', Store.prototype);
    apiSpy = jasmine.setupSpy('api', ElementTypeApi.prototype);
    sut = new ElementTypeActions(apiSpy, storeSpy);
  });

  it('loads the element type ', async done => {
    const expectElementTypes = [];

    apiSpy.getAll.and.returnValue(expectElementTypes);

    await sut.loadAll();

    expect(storeSpy.dispatch).toHaveBeenCalledWith({
      type: 'LOAD_ELEMENT_TYPES_SUCCESS', elementTypes: expectElementTypes
    });
    expect(storeSpy.dispatch.calls.argsFor(0)[0].elementTypes).toBe(expectElementTypes);
    done();
  });
});
