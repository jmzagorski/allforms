import '../../setup';
import { header } from '../../../../src/renderers/bootstrap';

describe('the boostrap header renderer', () => {
  let sut;

  it('creates a bootstrap header', () => {
    const options = { text: 'a', size: 4 };

    const sut = header.create(options);

    expect(sut.tagName).toEqual('H4');
    expect(sut.textContent).toEqual('a');
  });

  it('updates an existing header', () => {
    const $existing = document.createElement('H4');
    const options = { text: 'a', size: 4 };

    const $updated = header.update(options, $existing);

    expect($updated).toBe($existing);
    expect($existing.textContent).toEqual('a');
  });

  it('does not overflow the stack with an infinite loop', () => {
    const $existing = document.createElement('H4');
    const options = { text: 'a' };

    header.update(options, $existing);

    expect($existing.textContent).toEqual('a');
  });

  it('creates a new element when the option size changes', () => {
    const $existing = document.createElement('H4');
    const options = { text: 'a', size: 2 };

    const updated = header.update(options, $existing);

    expect(updated.tagName).toEqual('H2');
  });
});
