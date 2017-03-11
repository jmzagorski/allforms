import { Store } from '../../../src/config/store';
import * as redux from 'redux';

describe('the store initializer', () => {
  let sut;

  beforeEach(() => sut = new Store());

  it('defined the store interface', () => {
    expect(sut.getState).toBeDefined();
    expect(sut.dispatch).toBeDefined();
    expect(sut.subscribe).toBeDefined();
    expect(sut.replaceReducers).toBeDefined();
    expect(sut.observable).toBeDefined();
  });

  xit('initializes the store', () => {
    const initialState = {};
    const middleware = {};
    const reducer = {};
    const storeInstance = {};
    const createStoreSpy = spyOn(redux, 'createStore');
    const containerStub = {
      registerInstance: jasmine.createSpy('register')
    }

    createStoreSpy.and.returnValue(store);
    Store.init(containerStub, initialState, middleware);

    expect(createStoreSpy.calls.argsFor(0)[0]).toBe(reducer);
    expect(createStoreSpy.calls.argsFor(0)[1]).toBe(initialState);
    expect(createStoreSpy.calls.argsFor(0)[2]).toBe(middleware);
    expect(containerSpy.registerInstance.calls.argsFor(0)[0]).toBe(Store);
    expect(containerSpy.registerInstance.calls.argsFor(0)[1]).toBe(storeInstance);
  });
});
