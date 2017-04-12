import * as duplicator from '../../../src/elements/duplicator';

describe('the duplicator element', () => {

  it('has bootstrap properties', () => {
    const sut = duplicator.bootstrap();

    expect(sut.multiple).toBeFalsy();
    expect(sut.schema).toBeDefined();
    expect(sut.schema).toContain('attachment.html');
  });

  it('does not create a button when no element', () => {
    const sut = duplicator.bootstrap();
    sut.multiple = true;

    const $elem = sut.duplicate();

    expect($elem).toEqual(undefined)
  });

  it('does not create a button when multiple is false', () => {
    const $elem = document.createElement('div');
    const sut = duplicator.bootstrap();
    sut.multiple = false;

    const $elemWithAddOn = sut.duplicate($elem);

    expect($elem.querySelector('button')).toEqual(null);
    expect($elemWithAddOn).toBe($elem);
  });

  it('creates a bootstrap duplicator button', () => {
    const sut = duplicator.bootstrap();
    const $bodyMock = document.createElement('div');
    const $elem = document.createElement('input');
    $elem.name = 'a'
    $bodyMock.appendChild($elem);
    sut.multiple = true;

    sut.duplicate($elem);

    const $drawer = $elem.nextSibling;
    const $btn = $drawer.nextSibling;

    expect($drawer.tagName).toEqual('DIV');
    expect($drawer.id).toEqual('a-drawer');
    expect($drawer.className).toEqual('collapse');

    expect($btn.tagName).toEqual('BUTTON');
    expect($btn.getAttribute('data-toggle')).toEqual('collapse');
    expect($btn.getAttribute('data-target')).toEqual('#a-drawer');
    expect($btn.className).toEqual('btn btn-default btn-xs');
    expect($btn.style.backgroundColor).toEqual('transparent');

    const $glyph = $btn.children[0];
    expect($glyph.tagName).toEqual('SPAN');
    expect($glyph.className).toEqual('glyphicon glyphicon-resize-vertical');

    const $addBtn = $drawer.children[0];

    expect($addBtn.tagName).toEqual('BUTTON');
    expect($addBtn.textContent).toEqual('+');
    expect($addBtn.className).toEqual('btn btn-success btn-xs');
  });

  // integration test
  it('add a new input on click', done => {
    const sut = duplicator.bootstrap();
    const $bodyMock = document.createElement('div');
    const $elem = document.createElement('input');
    $elem.name = 'a'
    $bodyMock.appendChild($elem);
    sut.multiple = true;

    sut.duplicate($elem);

    const $drawer = $elem.nextSibling;
    const $addBtn = $drawer.children[0];
    $addBtn.click();

    setTimeout(() => {
      const $newInput = $addBtn.nextSibling;
      expect($newInput.tagName).toEqual('INPUT');
      done();
    })
  });

  // integration test
  it('deletes the new input on delete key', done => {
    const sut = duplicator.bootstrap();
    const $bodyMock = document.createElement('div');
    const $elem = document.createElement('input');
    const confirmSpy = spyOn(window, 'confirm').and.returnValue(true);
    $elem.name = 'a'
    $bodyMock.appendChild($elem);
    sut.multiple = true;

    sut.duplicate($elem);

    const $drawer = $elem.nextSibling;
    const $addBtn = $drawer.children[0];
    $addBtn.click();

    setTimeout(() => {
      const $newInput = $addBtn.nextSibling;
      const keydownEvent = new CustomEvent('keydown')
      keydownEvent.keyCode = 46;
      $newInput.dispatchEvent(keydownEvent);
      setTimeout(() => {
        expect($addBtn.nextSibling).toEqual(null);
        done();
      });
    })
  });
});
