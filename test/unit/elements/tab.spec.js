import * as tab from '../../../src/elements/tab';

describe('the tab element', () => {

  it('has bootstrap tab properties', () => {
    const sut = tab.bootstrap();

    expect(sut.id).toBeDefined();
    expect(sut.headers).toBeDefined();
    expect(sut.type).toBeDefined();
    expect(sut.schema).toBeDefined();
    expect(sut.schema).toContain('tabs.html');
    expect(sut.schema).toContain('types.html');
  });

  [ { headers: 'same,same', method: 'create' },
    { headers: 'same,same', method: 'mutate' }
  ].forEach(data => {
    it('throws when naming the same header', () => {
      const sut = tab.bootstrap();
      sut.headers = data.headers;

      const ex = () => sut[data.method]();

      expect(ex).toThrow(new Error('Cannot have duplicate headers'));
    });
  });

  it('creates a new bootstrap tab group', () => {
    const sut = tab.bootstrap();
    sut.id = 'navtab';
    sut.headers = 'test,one';
    sut.type = 'pill';

    const $elem = sut.create();

    expect($elem.tagName).toEqual('DIV');
    expect($elem.id).toEqual('navtab');
    expect($elem.style.height).toEqual('100%');
    expect($elem.style.width).toEqual('100%');

    const $nav = $elem.children[0];
    expect($nav.tagName).toEqual('UL');
    expect($nav.className).toEqual('nav nav-pills');

    const $item1 = $nav.children[0];
    expect($item1.tagName).toEqual('LI');
    expect($item1.className).toEqual('active');

    const $link1 = $item1.children[0];
    expect($link1.tagName).toEqual('A');
    expect($link1.getAttribute('data-toggle')).toEqual('pill');
    expect($link1.href).toContain('#testnavtab');
    expect($link1.textContent).toEqual('test');

    const $item2 = $nav.children[1];
    expect($item2.tagName).toEqual('LI');
    expect($item2.className).not.toEqual('active');

    const $link2 = $item2.children[0];
    expect($link2.tagName).toEqual('A');
    expect($link2.getAttribute('data-toggle')).toEqual('pill');
    expect($link2.href).toContain('#onenavtab');
    expect($link2.textContent).toEqual('one');

    const $contentWrapper = $elem.children[1];
    expect($contentWrapper.tagName).toEqual('DIV');
    expect($contentWrapper.className).toEqual('tab-content');
    expect($contentWrapper.style.height).toEqual('100%');
    expect($contentWrapper.style.width).toEqual('100%');
    expect($contentWrapper.style.border).toEqual('1px solid rgb(222, 226, 227)');

    const $firstContent = $contentWrapper.children[0];
    expect($firstContent.tagName).toEqual('DIV');
    expect($firstContent.id).toEqual('testnavtab');
    expect($firstContent.className).toEqual('tab-pane active');
    expect($firstContent.getAttribute('dropzone')).toEqual('');

    const $secondContent = $contentWrapper.children[1];
    expect($secondContent.tagName).toEqual('DIV');
    expect($secondContent.id).toEqual('onenavtab');
    expect($secondContent.className).toEqual('tab-pane');
    expect($secondContent.getAttribute('dropzone')).toEqual('');
  });

  [ { id: 11, expect: '11' }, { id: 'te st', expect: 'test'} ].forEach(data => {
    it('does not have spaces in the id', () => {
      const sut = tab.bootstrap();
      sut.id = data.id
      sut.headers = 'fi rst';
      sut.type = 'tab';

      const $elem = sut.create();

      expect($elem.id).toEqual(data.expect);

      const $a = $elem.querySelector('a');
      expect($a.href).toContain(`#first${data.expect}`);

      const $content = $elem.children[1].children[0];
      expect($content.id).toEqual(`first${data.expect}`);
    })
  })

  it('does not start the id with a number', () => {
    const sut = tab.bootstrap();
    sut.id = '1';
    sut.headers = '11deetwo';
    sut.type = 'tab';

    const $elem = sut.create();

    const $a = $elem.querySelector('a');
    expect($a.href).toContain(`#deetwo1`);

    const $content = $elem.children[1].children[0];
    expect($content.id).toEqual(`deetwo1`);
  });

  it('activates the first tab header', () => {
    const sut = tab.bootstrap();
    sut.id = 'navtab';
    sut.headers = 'Main, Sub';

    const $elem = sut.create();

    expect($elem.children[0].children[0].className).toEqual('active');
    expect($elem.children[0].children[1].className).not.toContain('active');
    expect($elem.children[0].children[1].className).not.toContain('in');
  });

  it('updates the headers while preserving the content', () => {
    const sut = tab.bootstrap();
    const content1 = '<div>Hi</div>';
    const content2 = '<div>Bye</div>';

    sut.id = 'navtab';
    sut.headers = 'one, two';
    sut.type = 'pill';

    const $existing = sut.create();
    sut.headers = 'three,four';
    sut.type = 'tab';

    $existing.children[1].children[0].innerHTML = content1;
    $existing.children[1].children[1].innerHTML = content2;

    const $updated = sut.mutate($existing);

    const $items = $updated.querySelectorAll('li');
    const contentWrapper = $updated.children[1];

    expect($updated).toBe($existing);
    expect($items.length).toEqual(2);
    expect($items[0].className).toContain('active');
    expect($items[1].className).not.toContain('active');

    const $link1 = $items[0].children[0];
    expect($link1.getAttribute('data-toggle')).toEqual('tab');
    expect($link1.href).toContain(`#threenavtab`);
    expect($link1.textContent).toEqual('three');

    const $content1 = contentWrapper.children[0];
    expect($content1.id).toEqual(`threenavtab`);
    expect($content1.innerHTML).toEqual(content1);

    const $link2 = $items[1].children[0];
    expect($link2.getAttribute('data-toggle')).toEqual('tab');
    expect($link2.href).toContain(`#fournavtab`);
    expect($link2.textContent).toEqual('four');

    const $content2 = contentWrapper.children[1];
    expect($content2.id).toEqual(`fournavtab`);
    expect($content2.innerHTML).toEqual(content2);
  });

  it('removes old headers', () => {
    const sut = tab.bootstrap();

    sut.id = 'navtab';
    sut.headers = 'one, two';
    sut.type = 'pill';

    const $existing = sut.create();
    sut.headers = 'one';

    const $updated = sut.mutate($existing);

    const $item = $updated.querySelectorAll('li');
    expect($item.length).toEqual(1);
  });

  it('adds new headers', () => {
    const sut = tab.bootstrap();

    sut.id = 'navtab';
    sut.headers = 'one';
    sut.type = 'pill';

    const $existing = sut.create();
    sut.headers = 'one,two';

    const $updated = sut.mutate($existing);

    const $item = $updated.querySelectorAll('li');
    expect($item.length).toEqual(2);
  });
});
