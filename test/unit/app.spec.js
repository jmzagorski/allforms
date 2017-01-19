import HttpConfig from '../../src/config/http-client';
import {HttpStub} from './stubs';
import {App} from '../../src/app';

describe('the app view model', () => {
  let sut;
  let httpConfSpy;
  let httpStub;
  let routerConfFxSpy;

  beforeEach(() => {
    httpConfSpy = jasmine.setupSpy('httpConf', HttpConfig.prototype);
    httpStub = new HttpStub();
    httpConfSpy.client = httpStub
    routerConfFxSpy = jasmine.createSpy('routerConf');
    sut = new App({ configure: routerConfFxSpy }, httpConfSpy);
  });

  it('configures the http client', async done => {
    httpStub.itemStub = {};

    await sut.activate();

    expect(httpConfSpy.configure.calls.count()).toEqual(1);
    done();
  });

  it('configures the router client', async done => {
    httpStub.itemStub = {};

    await sut.activate();

    expect(routerConfFxSpy.calls.count()).toEqual(1);
    done();
  });

  it('sets the username from the member', async done => {
    httpStub.itemStub = { loginName: 'a' };

    await sut.activate();

    expect(sut.username).toEqual('a');
    done();
  });
});
