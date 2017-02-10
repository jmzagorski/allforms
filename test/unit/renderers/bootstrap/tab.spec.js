import '../../setup';
import { tab } from '../../../../src/renderers/bootstrap';

describe('the boostrap tab renderer', () => {
  let element;

  afterEach(() => {
    if (element) {
      element.parentNode.removeChild(element);
      element = null;
    }
  })

  it('creates a new bootstrap tab when does not exist', () => {
    const options = { id: 'navtab', header: 'te st', type: 'pill' };

    const sut = tab(options);

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
    expect(content.className).toEqual('tab-pane fade in active');
  });

  it('uses an exiting tab when exists', () => {
    const options = { id: 'navtab' };
    element = tab(options);
    document.body.appendChild(element);

    const navtab = tab(options);

    expect(navtab).toBe(element);
    // test that the ul is the same
    expect(navtab.children[0]).toBe(element.children[0]);
    // test that the content wrapper is the same
    expect(navtab.children[1]).toBe(element.children[1]);
  });

  it('throws when naming the same header', () => {
    const options = { id: 'navtab', header: 'same' };
    element = tab(options);
    document.body.appendChild(element);

    const ex = () => tab(options);

    expect(ex).toThrow();
  });

  it('activates the most recent tab added', () => {
    const options = { id: 'navtab' };
    element = tab(options);
    document.body.appendChild(element);

    tab(options);

    expect(element.children[0].children[0].className).not.toEqual('active');
    expect(element.children[0].children[1].className).toEqual('active');
  });

  it('activates the tab on click', () => {
    const options = { id: 'navtab' };
    element = tab(options);
    document.body.appendChild(element);

    tab(options);
    element.querySelectorAll('a')[0].click();

    expect(element.children[0].children[0].className).toEqual('active');
    expect(element.children[0].children[1].className).not.toEqual('active');
  });
});
