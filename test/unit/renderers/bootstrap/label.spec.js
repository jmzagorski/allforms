import '../../setup';
import { label } from '../../../../src/renderers/bootstrap';

describe('the boostrap label renderer', () => {
  let sut;

  it('creates a bootstrap label', () => {
    const options = { type: 'a', name: 'g' };

    const sut = label(options);

    expect(sut.tagName).toEqual('SPAN');
    expect(sut.className).toEqual('label label-a');
    expect(sut.textContent).toEqual('g');
  });
});
