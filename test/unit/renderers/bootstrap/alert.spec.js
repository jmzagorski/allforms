import '../../setup';
import { alert } from '../../../../src/renderers/bootstrap';

describe('the boostrap alert renderer', () => {
  let sut;

  it('creates a bootstrap label', () => {
    const options = { type: 'a', text: 'g' };

    const sut = alert(options);

    expect(sut.tagName).toEqual('DIV');
    expect(sut.className).toEqual('alert alert-a');
    expect(sut.textContent).toEqual('g');
  });
});
