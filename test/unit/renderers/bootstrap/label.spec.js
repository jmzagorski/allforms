import '../../setup';
import { label } from '../../../../src/renderers/bootstrap';

describe('the boostrap label renderer', () => {
  let sut;

  it('creates a bootstrap label', () => {
    const options = { type: 'a', text: 'g' };

    const sut = label.create(options);

    expect(sut.tagName).toEqual('SPAN');
    expect(sut.className).toEqual('label label-a');
    expect(sut.textContent).toEqual('g');
  });

  it('updates a bootstrap label', () => {
    const $existing = document.createElement('span');
    const options = { type: 'a', text: 'g' };

    const $updated = label.update(options, $existing);

    expect($updated).toBe($existing);
    expect($existing.className).toEqual('label label-a');
    expect($existing.textContent).toEqual('g');
  });
});
