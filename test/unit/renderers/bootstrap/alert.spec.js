import '../../setup';
import { alert } from '../../../../src/renderers/bootstrap';

describe('the boostrap alert renderer', () => {
  let sut;

  it('creates a bootstrap alert', () => {
    const options = { type: 'a', text: 'g' };

    const sut = alert.create(options);

    expect(sut.tagName).toEqual('DIV');
    expect(sut.className).toEqual('alert alert-a');
    expect(sut.textContent).toEqual('g');
  });

  it('updates a bootstrap alert', () => {
    const options = { type: 'a', text: 'g' };
    const $existing = document.createElement('div');

    const $updated = alert.update(options, $existing);

    expect($updated).toBe($existing);
    expect($existing.className).toEqual('alert alert-a');
    expect($existing.textContent).toEqual('g');
  });
});
