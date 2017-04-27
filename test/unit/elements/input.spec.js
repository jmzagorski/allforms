import * as number from '../../../src/elements/number';
import * as date from '../../../src/elements/date';
import * as attachments from '../../../src/elements/attachments';
import * as text from '../../../src/elements/text';

// to make testing easier
const all = {
  number, date, attachments, text
};

describe('the input elements', () => {

  [ { method: 'number', type: 'number' },
    { method: 'attachments', type: 'file' },
    { method: 'date', type: 'date' },
    { method: 'text', type: 'text' } 
  ].forEach(data => {
    it('creates a bootstrap input type', () => {
      const sut = all[data.method].bootstrap();
      sut.text = 'a';
      sut.name = 'b';
      sut.required = true;

      const $elem = sut.create();

      expect($elem.tagName).toEqual('DIV');
      expect($elem.className).toEqual('form-group');

      const label = $elem.children[0];
      expect(label.tagName).toEqual('LABEL');
      expect(label.textContent).toEqual('a');

      const input = $elem.children[1];
      expect(input.tagName).toEqual('INPUT');
      expect(input.type).toEqual(data.type);
      expect(input.name).toEqual('b');
      expect(input.required).toBeTruthy();
      expect(input.className).toEqual('form-control');
    });
  });

  [ { method: 'number', type: 'number' },
    { method: 'attachments', type: 'file' },
    { method: 'date', type: 'date' },
    { method: 'text', type: 'text' } 
  ].forEach(data => {
    it('updates the bootstrap input', () => {
      const sut = all[data.method].bootstrap();
      sut.text = 'a'
      sut.name = 'b'
      const $existing = sut.create();
      sut.text = 'c'
      sut.name = 'd' // IMP cant change name right now;
      sut.required = true; 

      const $updated = sut.create($existing);

      expect($updated).toBe($existing);

      const $label = $updated.querySelector('label')
      const $input = $updated.querySelector('input')
      expect($label.textContent).toEqual('c');
      expect($input.required).toBeTruthy();
      expect($input.name).toBeTruthy();
      expect($input.type).toEqual(data.type);
    });
  });

  [ 'number', 'date' ].forEach(type => {
    it('creates the max and min attribute on the number and date', () => {
      const sut = all[type].bootstrap();
      sut.min = 1;
      sut.max = 3;

      const $elem = sut.create();

      expect($elem.children[1].getAttribute('min')).toEqual('1');
      expect($elem.children[1].getAttribute('max')).toEqual('3');
    });
  });

  [ 'number', 'date' ].forEach(type => {
    it('updates the max and min attribute on the number and date', () => {
      const sut = all[type].bootstrap();
      sut.min = 1;
      sut.max = 3;
      const $existing = sut.create();
      sut.min++;
      sut.max++;

      const $updated = sut.create($existing);

      expect($updated.children[1].getAttribute('min')).toEqual('2');
      expect($updated.children[1].getAttribute('max')).toEqual('4');
    });
  });
});
