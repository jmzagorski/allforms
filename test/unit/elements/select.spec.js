import * as select from '../../../src/elements/select';
import * as utils from '../../../src/utils';

describe('the select element', () => {

  it('has bootstrap select properties', () => {
    const sut = select.bootstrap();

    expect(sut.required).toBeFalsy();
    expect(sut.name).toBeDefined();
    expect(sut.text).toBeDefined();
    expect(sut.optionSrc).toBeDefined();
    expect(sut.schema).toBeDefined();
    expect(sut.schema).toContain('text.html');
    expect(sut.schema).toContain('name.html');
    expect(sut.schema).toContain('input.html');
    expect(sut.schema).toContain('file.html');
  });

  it('creates a bootstrap select list', done => {
    const sut = select.bootstrap();
    const blob = new Blob([JSON.stringify('id:a')], {type : 'application/json'});
    const parseSpy = spyOn(utils, 'parseCsv').and.returnValue([['hi', 'bye']]);

    sut.text = 'a';
    sut.optionSrc = [ blob ];
    sut.name = 'b';
    sut.required = true;

    const $elem = sut.create();

    expect($elem.tagName).toEqual('DIV');
    expect($elem.className).toEqual('form-group');

    const $label = $elem.children[0];
    expect($label.tagName).toEqual('LABEL');
    expect($label.textContent).toEqual('a');

    const $select = $elem.children[1];
    expect($select.tagName).toEqual('SELECT');
    expect($select.className).toEqual('form-control');
    expect($select.name).toEqual('b');
    expect($select.required).toBeTruthy();

    // setTimeout so onload can fire for FileReader
    setTimeout(() => {
      expect(parseSpy).toHaveBeenCalledWith('"id:a"', '\n', ',');
      expect($select.options.length).toEqual(1);
      expect($select.options[0].text).toEqual('bye');
      expect($select.options[0].value).toEqual('hi');
      done();
    });
  });

  it('updates a bootstrap select list', done => {
    const sut = select.bootstrap();
    const $existing = sut.create();

    const blob = new Blob([JSON.stringify('id:a')], {type : 'application/json'});

    sut.text = 'a';
    sut.name = 'b';
    sut.required = true;
    sut.optionSrc = [ blob ];

    const parseSpy = spyOn(utils, 'parseCsv').and.returnValue([['hi', 'bye']]);

    const $updated = sut.create($existing);

    const $label = $existing.children[0];
    const $select = $existing.children[1];

    expect($label.textContent).toEqual('a');
    expect($select.name).toEqual('b');
    expect($select.required).toBeTruthy();

    // setTimeout so onload can fire for FileReader
    setTimeout(() => {
      expect($updated).toBe($existing);
      expect(parseSpy).toHaveBeenCalledWith('"id:a"', '\n', ',');
      expect($select.options.length).toEqual(1);
      expect($select.options[0].text).toEqual('bye');
      expect($select.options[0].value).toEqual('hi');
      done();
    });
  });
});
