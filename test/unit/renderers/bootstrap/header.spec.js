import '../../setup';
import { header } from '../../../../src/renderers/bootstrap';

describe('the boostrap header renderer', () => {
  let sut;

  it('creates a bootstrap header', () => {
    const options = { name: 'a', size: 4 };

    const sut = header(options);

    expect(sut.tagName).toEqual('H4');
    expect(sut.textContent).toEqual('a');
  });
});
