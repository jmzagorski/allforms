import '../../setup';
import { select } from '../../../../src/renderers/bootstrap';

describe('the select input renderer', () => {
  let sut;

  it('creates a bootstrap select list', () => {
    const option = { text: 'hi', value: "12" };
    const options = { name: 'a', id: 'b', options: [ option ] };

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
    expect(select.options.length).toEqual(2);
    expect(select.options[0].text).toEqual('Select a value');
    expect(select.options[0].value).toEqual('');
    expect(select.options[1].text).toEqual(option.text);
    expect(select.options[1].value).toEqual(option.value);
  });
});
