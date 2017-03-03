import '../../setup';
import { alert } from '../../../../src/renderers/bootstrap';
import using from 'jasmine-data-provider';

describe('the boostrap alert renderer', () => {
  let sut;

  it('creates a bootstrap alert', () => {
    const options = { type: 'a', text: 'g' };

    const sut = alert.create(options);

    expect(sut.tagName).toEqual('DIV');
    expect(sut.className).toEqual('alert alert-a');
    expect(sut.textContent).toEqual('g');
  });

  using ([
    { className: '', type: 'a', expect: 'alert alert-a'},
    { className: 'test', type: 'b', expect: 'test alert alert-b'},
    { className: 'alert alert-b', type: 'd', expect: 'alert alert-d'},
  ], data => {
    it('updates a bootstrap alert', () => {
      const options = { type: data.type, text: 'g' };
      const $existing = document.createElement('div');
      $existing.className = data.className;

      const $updated = alert.update(options, $existing);

      expect($updated).toBe($existing);
      expect($existing.className).toEqual(data.expect);
      expect($existing.textContent).toEqual('g');
    });
  });
});
