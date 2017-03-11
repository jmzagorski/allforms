import * as LoggingInterceptor from 'aurelia-http-logger';
import {HttpStub} from '../stubs';
import HttpConfig from '../../../src/config/http-client';
import * as env from '../../../src/env';
import using from 'jasmine-data-provider';

describe('http client configuration', () => {
  let sut;
  let http;
  let configObj;
  let configs;

  beforeEach(() => {
    configs = [];
    spyOn(LoggingInterceptor, 'intercept').and.callFake((config) => {
      configs.push(config);
    });
    http = new HttpStub();
    sut = new HttpConfig(http);
    configObj = {
      withDefaults: obj => configObj,
      useStandardConfiguration: () => configObj,
      withBaseUrl: url => configObj,
      withInterceptor: obj => () => configObj 
    };

  });

  it('configures default headers', () => {
    let defaults = {};
    configObj.withDefaults = obj => {
      defaults = obj;
      return configObj;
    }

    sut.configure();
    http.config(configObj);

    expect(defaults.headers).toBeDefined();
    expect(defaults.headers['X-Requested-With']).toEqual('XMLHttpRequest');
  });

  it('uses standard configuration', () => {
    let isStandard = false;
    configObj.useStandardConfiguration = () => {
      isStandard = true;
      return configObj;
    }

    sut.configure();
    http.config(configObj);

    expect(isStandard).toBeTruthy();
  });

  it('sets base url', () => {
    let baseUrl = null;
    configObj.withBaseUrl = url => {
      baseUrl = url;
      return configObj;
    }
    spyOn(env, 'getBaseUrl').and.returnValue('test');

    sut.configure();
    http.config(configObj);

    expect(baseUrl).toEqual('test');
  });

  // just need to test if the status code is setup, not so much the message
  using([
    { statusCodes: [400], message: 'Bad Request', serverObjectName: 'validationErrors' },
    { statusCodes: [401], message: 'Authentication is required!' },
    { statusCodes: [403], message: 'Not Allowed! Please request access.' },
    { statusCodes: [500], message: 'You found a bug! Please contact support so we can fix it.' }
  ], expectConfig => {
    it('sets this interceptor', () => {
      let actualInterceptor;
      configObj.withInterceptor = i => {
        actualInterceptor = i;
        return configObj;
      }

      sut.configure();
      http.config(configObj);
      //const configs = actualInterceptor.getConfigs();

      expect(configs).toContain(expectConfig);
    });
  })
});
