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

  it('parses a basic csv string', () => {
    const text = 't,a,b\nb,v,y';

    const result = utils.parseCsv(text, '\n', ',');

    expect(result).toEqual([
      ['t','a','b'],
      ['b','v','y']
    ]);
  });

  it('finds the ending character', () => {
    const text = 'Hello(okay(again()))';

    const result = utils.getEndingCharPos(text, 5, '(');

    expect(result).toEqual(text.length - 1);
  });

  it('gets all the indices of the search string', () => {
    const text = 'Okay(ok(tryagain)ok)Okay';

    const result = utils.getIndicesOf('ok', text);

    expect(result).toEqual([5, 17]);
  });

  using ([
    { val: {}, expect: true },
    { val: [], expect: false },
    { val: 'a', expect: false },
    { val: null, expect: false },
    { val: undefined, expect: false }
  ], data => {
    it('returns true when value is an object', () => {
      const result = utils.isObject(data.val);

      expect(result).toEqual(data.expect);
    });
  });

  using ([
    { val: [], expect: true },
    { val: {}, expect: false },
    { val: 'a', expect: false },
    { val: null, expect: false },
    { val: undefined, expect: false }
  ], data => {
    it('returns true when value is an object', () => {
      const result = utils.isArray(data.val);

      expect(result).toEqual(data.expect);
    });
  });

  using ([
    { val: [], expect: '[object Array]' },
    { val: {}, expect: '[object Object]' },
    { val: 'a', expect: '[object String]' },
    { val: 1, expect: '[object Number]' }
  ], data => {
    it('returns true when value is an object', () => {
      const result = utils.getPrototypeString(data.val);

      expect(result).toEqual(data.expect);
    });
  });
});
