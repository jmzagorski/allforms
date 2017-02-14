import './setup';
import * as utils from '../../src/utils';
import using from 'jasmine-data-provider';

describe('the utility functions', () => {

  using([
    { path: '/', segs: [ {url: '#/', display: '' }], start: 1, hash: '#/' },
    { path: '/', segs: [ ], start: 1 },
    { path: '/', segs: [ {url: '', display: ''} ], start: null },
    { path: '/a', segs: [ {url: '', display: ''}, {url: '/a', display: 'a'} ], start: null },
    { path: '/a/b at', segs: [ {url: '', display: ''}, {url: '/a', display: 'a'}, {url: '/a/b-at', display: 'b at'} ], start: null }
  ], data => {
    it('returns the links based on the path name', () => {
      const loc = { pathname: data.path, hash: data.hash || '' };

      // just return the url so i can testt he filter method
      const encodeSpy = spyOn(window, 'encodeURI')
      encodeSpy.and.callFake(url => url);

      const segments = utils.buildLocationLinks(loc, data.start);

      expect(segments).toEqual(data.segs);
      expect(encodeSpy.calls.count()).toEqual(data.segs.length);
    });
  });

  it('returns true when has duplicates', () => {
    const actual = utils.hasDuplicates(['a','a']);

    expect(actual).toBeTruthy();
  });

  it('returns false when has duplicates', () => {
    const actual = utils.hasDuplicates(['a','b']);

    expect(actual).toBeFalsy();
  });
});
