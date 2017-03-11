import { ElementTypeApi } from '../../../../src/api/element-type-api';
import { ElementTypeActions } from '../../../../src/domain/index';
import { Store } from '../../../../src/config/store';
import { setupSpy } from '../../jasmine-helpers';

describe('the element type actions', () => {
  var sut;
  var storeSpy;
  var apiSpy;

  beforeEach(() => {
    storeSpy = setupSpy('store', Store.prototype);
    apiSpy = setupSpy('api', ElementTypeApi.prototype);
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
