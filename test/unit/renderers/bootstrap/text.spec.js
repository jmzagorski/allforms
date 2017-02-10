import '../../setup';
import { text } from '../../../../src/renderers/bootstrap';

describe('the boostrap text renderer', () => {
  let sut;

  it('creates a bootstrap text area', () => {
    const options = { name: 'a', id: "3", rows: 3 };

    const sut = text(options);

    expect(sut.tagName).toEqual('DIV');
    expect(sut.className).toEqual('form-group');

    const label = sut.children[0];
    expect(label.tagName).toEqual('LABEL');
    expect(label.textContent).toEqual(options.name);
    expect(label.htmlfor).toEqual(options.id);

    const input = sut.children[1];
    expect(input.tagName).toEqual('TEXTAREA');
    expect(input.id).toEqual(options.id);
    expect(input.rows).toEqual(options.rows);
    expect(input.className).toEqual('form-control');
  });
});
