import '../../setup';
import { tab } from '../../../../src/renderers/bootstrap';

describe('the boostrap tab renderer', () => {

  it('creates a new bootstrap tab group', () => {
    const options = { name: 'navtab', headers: 'te st', type: 'pill' };

    const sut = tab(options);

    expect(sut.tagName).toEqual('DIV');
    expect(sut.id).toEqual(options.name);

    const nav = sut.children[0];
    expect(nav.tagName).toEqual('UL');
    expect(nav.className).toEqual('nav nav-pills');

    const item = nav.children[0];
    expect(item.tagName).toEqual('LI');
    expect(item.className).toEqual('active');

    const link = item.children[0];
    expect(link.tagName).toEqual('A');
    expect(link.getAttribute('data-toggle')).toEqual(options.type);
    expect(link.href).toContain('#navtabtest');
    expect(link.textContent).toContain('te st');

    const contentWrapper = sut.children[1];
    expect(contentWrapper.tagName).toEqual('DIV');
    expect(contentWrapper.className).toEqual('tab-content');

    const content = contentWrapper.children[0];
    expect(content.tagName).toEqual('DIV');
    expect(content.id).toContain('navtabtest');
    expect(content.className).toEqual('tab-pane fade in active');
  });

  using([
    ['same,same'],
    ['same, same'],
  ], headers => {
    it('throws when naming the same header', () => {
      const options = { name: 'navtab', headers };

      const ex = () => tab(options);

      expect(ex).toThrow(new Error('Cannot have duplicate headers'));
    });
  });

  it('activates the first tab header', () => {
    const options = { name: 'navtab', headers: 'Main, Sub' };

    const tabGroup = tab(options);

    expect(tabGroup.children[0].children[0].className).toEqual('active');
    expect(tabGroup.children[0].children[1].className).not.toEqual('active');
  });

  it('activates the tab on click', () => {
    const options = { headers: 'Main, Sub', name: 'navtab' };

    var tabGroup = tab(options);
    tabGroup.querySelectorAll('a')[0].click();

    expect(tabGroup.children[0].children[0].className).toEqual('active');
    expect(tabGroup.children[0].children[1].className).not.toEqual('active');
  });
});
