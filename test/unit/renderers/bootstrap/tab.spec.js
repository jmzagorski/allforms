import '../../setup';
import { tab } from '../../../../src/renderers/bootstrap';

describe('the boostrap tab renderer', () => {

  it('creates a new bootstrap tab group', () => {
    const options = { id: 'navtab', headers: 'te st', type: 'pill' };

    const sut = tab.create(options);

    expect(sut.tagName).toEqual('DIV');
    expect(sut.id).toEqual(options.id);

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
    { headers: 'same,same', method: 'create' },
    { headers: 'same,same', method: 'update' }
  ], data => {
    it('throws when naming the same header', () => {
      const options = { headers: data.headers };

      const ex = () => tab[data.method](options);

      expect(ex).toThrow(new Error('Cannot have duplicate headers'));
    });
  });

  it('activates the first tab header', () => {
    const options = { id: 'navtab', headers: 'Main, Sub' };

    const tabGroup = tab.create(options);

    expect(tabGroup.children[0].children[0].className).toEqual('active');
    expect(tabGroup.children[0].children[1].className).not.toEqual('active');
  });

  it('activates the tab on click', () => {
    const options = { headers: 'Main, Sub', id: 'navtab' };

    var tabGroup = tab.create(options);
    tabGroup.querySelectorAll('a')[0].click();

    expect(tabGroup.children[0].children[0].className).toEqual('active');
    expect(tabGroup.children[0].children[1].className).not.toEqual('active');
  });

  using ([
    { headers: 'main', headerArry: [ 'main' ], length: 1 },
    { headers: 'main, sub', headerArry: [ 'main', 'sub' ], length: 2 },
    { headers: 'main, sub, little', headerArry: [ 'main', 'sub', 'little' ], length: 3 }
  ], data => {
    it('updates the headers', () => {
      const options = { id: 'navtab', headers: 'one, two', type: 'pill' };
      const $existing = tab.create(options);
      options.headers = data.headers;
      options.type = 'tab';

      const $updated = tab.update(options, $existing);

      const item = $existing.querySelectorAll('li');
      const contentWrapper = $existing.children[1];

      expect($updated).toBe($existing);
      expect(item.length).toEqual(data.length);

      for (let i = 0; i < data.headerArry.length; i++) {
        const link = item[i].children[0];
        const header = data.headerArry[i];
        const content = contentWrapper.children[i];
        expect(link.getAttribute('data-toggle')).toEqual('tab');
        expect(link.href).toContain(`#navtab${header}`);
        expect(link.textContent).toContain(header);
        expect(content.id).toContain(`navtab${header}`);
      }
    });
  });
});
