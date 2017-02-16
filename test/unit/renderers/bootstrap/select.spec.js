import '../../setup';
import { select } from '../../../../src/renderers/bootstrap';
import * as utils from '../../../../src/utils';

describe('the select input renderer', () => {
  let sut;

  it('creates a bootstrap select list', done => {
    const blob = new Blob([JSON.stringify('id:a')], {type : 'application/json'});
    const options = { name: 'a', id: 'b', optionSrc: [ blob ] };
    const parseSpy = spyOn(utils, 'parseCsv').and.returnValue([['hi', 'bye']]);

    parseSpy.and.returnValue([['hi', 'bye']]);

    const sut = select(options);

    expect(sut.tagName).toEqual('DIV');
    expect(sut.className).toEqual('form-group');

    const label = sut.children[0];
    expect(label.tagName).toEqual('LABEL');
    expect(label.textContent).toEqual(options.name);
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
});
