import * as domServices from '../../../../src/elements/services/dom-service';
import { DOM } from 'aurelia-pal';

describe('the dom service', () => {

  [ { code: 46, length: 0, confirms: 1, expectResponse: true },
    { code: 6, length: 1, confirms: 0 , expectResponse: undefined }
  ].forEach(data => {
    it('removes target on delete key', () => {
      const $parent = document.createElement('div');
      const $child = document.createElement('span');
      const confirmSpy = spyOn(window, 'confirm').and.returnValue(data.confirms);
      $child.id = '1';
      $parent.appendChild($child)
      let event = {
        keyCode: data.code,
        target: $child
      };

      const response = domServices.deleteTarget(event);

      expect(confirmSpy.calls.count()).toEqual(data.confirms);
      expect($parent.children.length).toEqual(data.length);
      expect(response).toEqual(data.expectResponse);

      if (data.confirms) {
        expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to delete this element?');
      }
    });
  });

  it('deep clones the target', () => {
    const $original = document.createElement('div');
    const $nested = document.createElement('input');
    $original.id = '1';
    $original.className = 'a';
    $nested.id = '2';
    $nested.name = 'b';
    $nested.value = '3';
    $original.appendChild($nested);
    
    const $cloned = domServices.deepClone($original);

    expect($cloned.tagName).toEqual('DIV');
    expect($cloned.id).toEqual('');
    expect($cloned.className).toEqual('a');
    expect($cloned.children[0].tagName).toEqual('INPUT');
    expect($cloned.children[0].id).toEqual('');
    expect($cloned.children[0].name).toEqual('b');
    expect($cloned.children[0].value).toEqual('3');
  });

  it('sets the default value for any element', () => {
    const el = document.createElement('input');
    el.type = 'input';
    el.value = 1;

    domServices.setDefaultVal(el);

    expect(el.defaultValue).toEqual(el.value);
  });

  using([ true, false ], checked => {
    it('sets the checked attribute for a checkbox', () => {
      const el = document.createElement('input');
      el.type = 'checkbox';
      el.value = 'on';
      el.checked = checked;

      domServices.setDefaultVal(el);
      const attr = el.getAttribute('checked') == null ? false : true;

      expect(el.defaultValue).toEqual(el.value);
      expect(el.checked).toEqual(checked);
      expect(attr).toEqual(checked);
    });
  });

  using([ true, false ], expectOn => {
    it('sets the checked attribute for a radio', () => {
      const off = document.createElement('input');
      const on = document.createElement('input');
      off.type = 'radio';
      off.name = 'a';
      off.setAttribute('checked', '');
      on.value = 'off';
      on.type = 'radio';
      on.value = 'on';
      on.checked = expectOn;
      on.name = 'a';

      const domSpy = spyOn(DOM, 'querySelectorAll').and.returnValue([ on, off ]);

      domServices.setDefaultVal(on);
      const onChecked = on.getAttribute('checked') == null ? false : true;
      const offChecked = off.getAttribute('checked') == null ? false : true;

      expect(on.defaultValue).toEqual(on.value);
      expect(on.checked).toEqual(expectOn);
      expect(onChecked).toEqual(expectOn);
      expect(offChecked).toBeFalsy();
    });
  });

  it('sets the default options for a select', () => {
    const opt1 = new Option(1,2);
    const opt2 = new Option(3,4);
    const el = document.createElement('select');
    el.options[0] = opt1;
    el.options[1] = opt2;
    el.selectedIndex = 1;

    domServices.setDefaultVal(el);

    expect(el.defaultValue).toEqual('4');
    expect(opt2.getAttribute('selected')).toBeTruthy();
    expect(opt1.getAttribute('selected')).toEqual(null);
  });
})
