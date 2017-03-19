import { HttpStub } from '../stubs';
import sut from '../../../src/config/http-client';
import * as LoggingInterceptor from 'aurelia-http-logger';

describe('http client configuration', () => {
  let http;
  let configObj;

  beforeEach(() => {
    http = new HttpStub();
    configObj = {
      withDefaults: obj => configObj,
      useStandardConfiguration: () => configObj,
      withBaseUrl: url => configObj,
      withInterceptor: obj => () => configObj 
    };
  });

  it('uses standard configuration', () => {
    let isStandard = false;
    configObj.useStandardConfiguration = () => {
      isStandard = true;
      return configObj;
    }

    sut(http);
    http.config(configObj);

    expect(isStandard).toBeTruthy();
  });

  it('configures default headers', () => {
    let defaults = {};
    configObj.withDefaults = obj => {
      defaults = obj;
      return configObj;
    }

    sut(http);
    http.config(configObj);

    expect(defaults.headers).toBeDefined();
    expect(defaults.headers['X-Requested-With']).toEqual('XMLHttpRequest');
  });

  it('sets base url', () => {
    let baseUrl = null;
    configObj.withBaseUrl = url => {
      baseUrl = url;
      return configObj;
    }

    sut(http, 'test')
    http.config(configObj);

    expect(baseUrl).toEqual('test');
  });

  it('sets this interceptor', () => {
    let actualInterceptor;
    configObj.withInterceptor = i => {
      actualInterceptor = i;
      return configObj;
    }

    sut(http)
    http.config(configObj);

    expect(actualInterceptor).toBe(LoggingInterceptor);
  })
});
