import * as checkbox from '../../../src/elements/checkbox';
import * as radio from '../../../src/elements/radio';

const all = { checkbox, radio };

describe('the option elememts', () => {

  [ 'radio', 'checkbox' ].forEach(type => {
    it('creates a bootstrap checkbox or radio', () => {
      const sut = all[type].bootstrap();
      sut.text = 'header';
      sut.options = 'yes,no';

      const $elem = sut.create();

      expect($elem.tagName).toEqual('DIV');
      expect($elem.style.border).toEqual('1px solid rgb(222, 226, 227)');
      expect($elem.children.length).toEqual(3);
      expect($elem.innerText).toEqual('header\nyesno');

      expect($elem.children[0].tagName).toEqual('BR');

      const $input1 = $elem.children[1].children[0];
      expect($input1.tagName).toEqual('INPUT');
      expect($input1.type).toEqual(type);
      expect($input1.value).toEqual('yes');
      expect($input1.required).toBeFalsy();

      const $label1 = $elem.children[1];
      expect($label1.tagName).toEqual('LABEL');
      expect($label1.innerHTML).toEqual($input1.outerHTML + 'yes');
      expect($label1.className).toEqual(`${type}-inline`);

      const $input2 = $elem.children[2].children[0];
      expect($input2.tagName).toEqual('INPUT');
      expect($input2.type).toEqual(type);
      expect($input2.value).toEqual('no');
      expect($input2.required).toBeFalsy();

      const $label2 = $elem.children[2]
      expect($label2.tagName).toEqual('LABEL');
      expect($label2.innerHTML).toEqual($input2.outerHTML + 'no');
      expect($label2.className).toEqual(`${type}-inline`);
    });
  });

  [ { type : 'radio', count: 1, options: 'maybe', required: true },
    { type : 'radio', count: 3, options: 'yes,no,maybe', required: false },
    { type : 'checkbox', count: 1, options: 'maybe', required: true },
    { type : 'checkbox', count: 3, options: 'yes,no,maybe', required: false },
  ].forEach(data => {
    it('updates a bootstrap checkbox or radio', () => {
      const sut = all[data.type].bootstrap();
      sut.text = 'a'
      sut.required = true;
      sut.options = 'yes,no'
      const $existing = sut.create();
      sut.text = 'b'
      sut.options = data.options;

      const $updated = sut.create($existing);

      const $input = $updated.querySelector('input');

      expect($updated).toBe($existing);
      expect($input.type).toEqual(data.type);
      expect($updated.innerText).toContain('b\n');
      // plus one because of the <br> tag
      expect($updated.children.length).toEqual(data.count + 1);
      expect($updated.children[1].children[0].required).toEqual(data.required);
    });
  });
});
