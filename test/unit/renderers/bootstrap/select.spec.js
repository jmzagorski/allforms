import { select } from '../../../../src/renderers/bootstrap';
import * as utils from '../../../../src/utils';

describe('the select input renderer', () => {
  let sut;

  it('creates a bootstrap select list', done => {
    const blob = new Blob([JSON.stringify('id:a')], {type : 'application/json'});
    const options = { text: 'a', id: 'b', optionSrc: [ blob ] };
    const parseSpy = spyOn(utils, 'parseCsv').and.returnValue([['hi', 'bye']]);

    parseSpy.and.returnValue([['hi', 'bye']]);

    const sut = select.create(options);

    expect(sut.tagName).toEqual('DIV');
    expect(sut.className).toEqual('form-group');

    const label = sut.children[0];
    expect(label.tagName).toEqual('LABEL');
    expect(label.textContent).toEqual(options.text);
    expect(label.htmlfor).toEqual(options.id);

    const select = sut.children[1];
    expect(select.tagName).toEqual('SELECT');
    expect(select.id).toEqual(options.id);
    expect(select.className).toEqual('form-control');

    // setTimeout so onload can fire for FileReader
    setTimeout(() => {
      expect(parseSpy).toHaveBeenCalledWith('"id:a"', '\n', ',');
      expect(select.options.length).toEqual(1);
      expect(select.options[0].text).toEqual('bye');
      expect(select.options[0].value).toEqual('hi');
      done();
    });
  });

  it('updates a bootstrap select list', done => {
    const options = { text: 'a', optionSrc: null };
    const $existing = select.create(options);
    const blob = new Blob([JSON.stringify('id:a')], {type : 'application/json'});
    options.optionSrc = [ blob ];
    const parseSpy = spyOn(utils, 'parseCsv').and.returnValue([['hi', 'bye']]);

    parseSpy.and.returnValue([['hi', 'bye']]);

    const $updated = select.update(options, $existing);

    const label = $existing.children[0];
    const $select = $existing.children[1];

    expect(label.textContent).toEqual(options.text);

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
