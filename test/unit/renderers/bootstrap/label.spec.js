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

  using ([
    { className: '', type: 'a', expect: 'label label-a'},
    { className: 'test', type: 'b', expect: 'test label label-b'},
    { className: 'label label-b', type: 'd', expect: 'label label-d'},
  ], data => {
    it('updates a bootstrap label', () => {
      const $existing = document.createElement('span');
      $existing.className = data.className;
      const options = { type: data.type, text: 'g' };

      const $updated = label.update(options, $existing);

      expect($updated).toBe($existing);
      expect($existing.className).toEqual(data.expect);
      expect($existing.textContent).toEqual('g');
    });
  });
});
