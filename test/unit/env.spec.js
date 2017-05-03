import { EnvironmentService } from '../../src/env';

describe('the environment functions', () => {

  [ { port: null, hostname: 'test', expectUrl: '/api/' },
    { port: undefined, hostname: 'test', expectUrl: '/api/' },
    { port: 0, hostname: 'test', expectUrl: '/api/' },
    { port: 3, hostname: 'test', expectUrl: 'http://test:9001/api/' }
  ].forEach(rec => {
    it('generates the application base url based on the env', () => {
      const platformStub = {
        location: { port: rec.port, hostname: rec.hostname }
      };
      const sut = new EnvironmentService(platformStub);

      const url = sut.generateBaseApi();

      expect(url).toEqual(rec.expectUrl);
    });
  });

  [ '', '/api/', 'http://test:9001/api/', 'http://test:9001/api/something' ].forEach(api => {
    it('returns true for local apis', () => {
      const platformStub = {
        location: { port: 1, hostname: 'test' }
      };
      const sut = new EnvironmentService(platformStub);
      const isLocal = sut.isLocalApi(api);

      expect(isLocal).toBeTruthy();
    });
  });

  it('returns false for external apis', () => {
    const platformStub = {
      location: {  }
    };
    const sut = new EnvironmentService(platformStub);
    const isLocal = sut.isLocalApi('http');

    expect(isLocal).toBeFalsy();
  });
});
