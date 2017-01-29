import './setup';
import * as env from '../../src/env';
import using from 'jasmine-data-provider';

describe('the environment functions', () => {

  using([
    { port: null, hostname: 'test', expectUrl: '/api/' },
    { port: undefined, hostname: 'test', expectUrl: '/api/' },
    { port: 0, hostname: 'test', expectUrl: '/api/' },
    { port: 3, hostname: 'test', expectUrl: 'http://test:9001/api/' }
  ], data => {
    it('gets the base URL based on the port existence', () => {
      const loc = { port: data.port, hostname: data.hostname };

      const url = env.getBaseUrl(loc);

      expect(url).toEqual(data.expectUrl);
    });
  })
});
