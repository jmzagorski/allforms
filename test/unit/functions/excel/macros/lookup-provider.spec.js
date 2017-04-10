import { HttpClient } from 'aurelia-fetch-client';
import { Lookup }  from '../../../../../src/functions/excel/macros/lookup';
import * as selectors from '../../../../../src/domain/form/selectors';
import { setupSpy } from '../../../jasmine-helpers';
import { LookupProvider } from '../../../../../src/functions/excel/macros/lookup-provider';
import { Store } from 'aurelia-redux-plugin';

describe('the lookup provider class', () => {
  let sut;
  let httpSpy;
  let selectorSpy;
  let storeSpy;

  beforeEach(() => {
    httpSpy = setupSpy('http', HttpClient.prototype);
    storeSpy = setupSpy('store', Store.prototype);
    sut = new LookupProvider(storeSpy, httpSpy);

    selectorSpy = spyOn(selectors, 'getActiveForm').and.returnValue({ api: 'a' });
  });

  it('configures a new http client', () => {
    let isStandard = false;
    let pFunc = null;
    let config = {
      useStandardConfiguration: () => isStandard = true
    };
    httpSpy.configure.and.callFake(func => pFunc = func);

    sut.provide();
    pFunc(config);

    expect(config).not.toEqual(null);
    expect(isStandard).toBeTruthy();
  });

  // TODO - cannot test that i passed the right params to the ctor
  it('returns a new lookup class', () => {
    const actual = sut.provide();

    expect(actual).toEqual(jasmine.any(Lookup))
  });
});
