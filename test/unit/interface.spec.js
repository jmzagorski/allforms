import { Store } from 'aurelia-redux-plugin';
import { Interface } from '../../src/interface';
import { setupSpy } from './jasmine-helpers';
import * as metadataSelectors from '../../src/domain/metadata/selectors';
import { requestForm, requestMetadata } from '../../src/domain';

describe('the interface view model', () => {
  let sut;
  let storeSpy;
  let getMetadataSpy;

  beforeEach(() => {
    storeSpy = setupSpy('store', Store.prototype);
    getMetadataSpy = spyOn(metadataSelectors, 'getAllMetadataStatuses');

    sut = new Interface(storeSpy);
  });

  it('initializes the view mode public props', () => {
    expect(sut.gridOptions).toEqual({ forceFitColumns: true });
    expect(sut.contextOptions).toEqual({ contextIcon: 'fa fa-handshake-o' });
    expect(sut.statuses).toEqual([]);
  });

  it('dispatches requests to get the view model data', () => {
    sut.activate({ form: 'a' });

    expect(storeSpy.dispatch.calls.argsFor(0)[0]).toEqual(requestForm('a'));
    expect(storeSpy.dispatch.calls.argsFor(1)[0]).toEqual(requestMetadata('a'));
  });

  it('subscribes to the store to get the metadata statuses', () => {
    let updateFunc = null;
    const state = {};
    const statuses = [ { id: 1} ];

    storeSpy.getState.and.returnValue(state);
    getMetadataSpy.and.returnValue(statuses);
    storeSpy.subscribe.and.callFake(func => updateFunc = func);
    sut.activate({ });

    updateFunc();

    expect(getMetadataSpy.calls.argsFor(0)[0]).toBe(state);
    expect(sut.statuses).toEqual(statuses);
  });

  it('unsubscribes on deactivate', () => {
    let unsubscribe = 0;
    const subscription = () => ++unsubscribe;

    storeSpy.subscribe.and.returnValues(subscription);
    sut.activate({ });

    sut.deactivate();

    expect(unsubscribe).toEqual(1);
  });
});
