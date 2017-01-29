import './setup';
import * as utils from '../../src/utils';
import using from 'jasmine-data-provider';

describe('the utility functions', () => {

  using([
    { path: '/', segs: [ {url: '#/', display: '' }], start: 1, hash: '#/' },
    { path: '/', segs: [ ], start: 1 },
    { path: '/', segs: [ {url: '', display: ''} ], start: null },
    { path: '/a', segs: [ {url: '', display: ''}, {url: '/a', display: 'a'} ], start: null },
    { path: '/a/b', segs: [ {url: '', display: ''}, {url: '/a', display: 'a'}, {url: '/a/b', display: 'b'} ], start: null }
  ], data => {
    it('returns the links based on the path name', () => {
      const loc = { pathname: data.path, hash: data.hash || '' };

      const segments = utils.buildLocationLinks(loc, data.start);

      expect(segments).toEqual(data.segs);
    });
  });
});
