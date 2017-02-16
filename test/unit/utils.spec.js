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

  it('returns a ranom Id between 1 and 1000', () => {
    const actual = utils.randomId();

    expect(actual).toBeGreaterThan(0);
    expect(actual).toBeLessThan(1000);
  });

  it('sets the default value for an element (not an option)', () => {
    const el = document.createElement('input');
    el.type = 'input';
    el.value = 1;

    utils.setDefaultVal(el);

    expect(el.defaultValue).toEqual(el.value);
  });

  using([ true, false ], checked => {
    it('sets the default value for a checkbox', () => {
      const el = document.createElement('input');
      el.type = 'checkbox';
      el.value = 'on';
      el.checked = checked;

      utils.setDefaultVal(el);
      const attr = el.getAttribute('checked') == null ? false : true;

      expect(el.defaultValue).toEqual(el.value);
      expect(el.checked).toEqual(checked);
      expect(attr).toEqual(checked);
    });
  });

  it('sets the default options for a select', () => {
    const opt1 = new Option(1,2);
    const opt2 = new Option(3,4);
    const el = document.createElement('select');
    el.options[0] = opt1;
    el.options[1] = opt2;
    el.selectedIndex = 0;
    opt2.setAttribute('selected', true)

    utils.setDefaultVal(el);

    expect(el.defaultValue).toEqual(el.value);
    expect(opt2.getAttribute('selected')).toEqual(null);
    expect(opt1.getAttribute('selected')).toBeTruthy();
  });

  it('parses a basic csv string', () => {
    const text = 't,a,b\nb,v,y';

    const result = utils.parseCsv(text, '\n', ',');

    expect(result).toEqual([
      ['t','a','b'],
      ['b','v','y']
    ]);
  });
});
