import { HttpClient } from 'aurelia-fetch-client';
import { Lookup }  from '../../../../../src/functions/excel/macros/lookup';
import { LookupProvider } from '../../../../../src/functions/excel/macros/lookup-provider';
import { setupSpy } from '../../../jasmine-helpers';

describe('the lookup provider class', () => {
  let sut;
  let newHttpSpy;
  let appHttpSpy;

  beforeEach(() => {
    newHttpSpy = setupSpy('http', HttpClient.prototype);
    appHttpSpy = setupSpy('http', HttpClient.prototype);
  });

  it('configures a new http client', () => {
    let isStandard = false;
    let intercepted = false;
    let pFunc = null;
    let defaultObj = null;
    let baseUrl = null;
    let config = {
      useStandardConfiguration: () => {
        isStandard = true;
        return config
      },
      withDefaults: defaults => {
        defaultObj = defaults;
        return config;
      },
      withBaseUrl: url => {
        baseUrl = url;
        return config;
      },
      withInterceptor: interceptor => intercepted = true
    };
    newHttpSpy.configure.and.callFake(func => pFunc = func);

    sut = new LookupProvider(newHttpSpy, appHttpSpy);
    pFunc(config);

    expect(config).not.toEqual(null);
    expect(isStandard).toBeTruthy();
    expect(appHttpSpy.configure).not.toHaveBeenCalled();
  });

  it('returns a new lookup class', () => {
    const actual = sut.provide();

    expect(actual).toEqual(jasmine.any(Lookup))
  });

  // TODO - cannot test that i passed the right params to the ctor
});
