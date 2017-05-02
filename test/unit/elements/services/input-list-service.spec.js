import { InputListService } from '../../../../src/elements/services/input-list-service';
import * as domService from '../../../../src/elements/services/dom-service';

describe('the input list form service', () => {
  let sut;
  let cloneSpy;
  let deleteSpy;

  beforeEach(() => {
    sut = new InputListService();

    deleteSpy = spyOn(domService, 'deleteTarget');

    cloneSpy = spyOn(domService, 'deepClone').and.callFake($elem => {
      const $clone = document.createElement($elem.tagName);
      $clone.name = $elem.name;
      $clone.setAttribute('input-list', '');
      return $clone;
    })
  });

  it('does nothing when there is no data', () => {
    const ex = () => sut.populate();

    // it would throw if the data was missing and i did not account for that
    expect(ex).not.toThrow();
  });

  it('creates a new list of inputs', () => {
    const $form = document.createElement('form');
    const $input1 = document.createElement('input');
    $input1.name = 'a';
    $input1.setAttribute('input-list', '');
    const $input2 = document.createElement('input');
    $input2.name = 'b';
    $input2.setAttribute('input-list', '');
    // this 3rd element will test to make sure it is not clones 
    const $input3 = document.createElement('input');
    $form.appendChild($input1);
    $form.appendChild(document.createElement('div')); // stub the drawer
    $form.appendChild($input2);
    $form.appendChild(document.createElement('div'));
    $form.appendChild($input3);
    const data = { a: [ 1, 2 ], b: [ 3, 4 ] };

    sut.populate($form, data);

    const $inputList1 = $form.children[1].children[0];
    const $inputList2 = $form.children[3].children[0];

    expect(cloneSpy.calls.count()).toEqual(2);
    // the cloned elements should not have a custom attribute
    expect($form.querySelectorAll('[input-list]').length).toEqual(2);
    // the parent inputs are not handled by this service only the actual input
    // list elements
    expect($form.children[0].value).toEqual('');
    expect($form.children[2].value).toEqual('');
    expect($inputList1.tagName).toEqual('INPUT');
    expect($inputList1.name).toEqual('a');
    expect($inputList1.value).toEqual('2');
    expect($inputList1.onkeydown).toBe(deleteSpy);
    expect($inputList1.getAttribute('input-list')).toEqual(null);
    expect($inputList2.tagName).toEqual('INPUT');
    expect($inputList2.name).toEqual('b');
    expect($inputList2.value).toEqual('4');
    expect($inputList2.onkeydown).toBe(deleteSpy);
    expect($inputList2.getAttribute('input-list')).toEqual(null);
  });

  it('uses the existing input lists', () => {
    const $form = document.createElement('form');
    const $input1 = document.createElement('input');
    const $input2 = document.createElement('input');
    const $drawer = document.createElement('div');
    $input1.name = 'a';
    $input1.setAttribute('input-list', '');
    $input2.name = 'a';
    // this 3rd element will test to make sure it is not clones 
    $form.appendChild($input1);
    $drawer.appendChild($input2);
    $form.appendChild($drawer); // stub the drawer
    $form.appendChild(document.createElement('div'));
    const data = { a: [ 1, 2, 3 ] };

    sut.populate($form, data);

    const $inputList1 = $form.children[1].children[0];
    const $inputList2 = $form.children[1].children[1];

    // list elements
    expect($inputList1).toBe($input2);
    expect($inputList1.value).toEqual('2');
    expect($inputList2.value).toEqual('3');
  });
})
