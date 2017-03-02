import '../../setup';
import * as renderers from '../../../../src/renderers/bootstrap';
import using from 'jasmine-data-provider';

describe('the option renderer', () => {
  let sut;

  using([ 'radio', 'checkbox' ], type => {
    it('creates a bootstrap checkbox or radio', () => {
      const options = { label: 'b' };

      const label = renderers[type].create(options);
      const input = label.children[0];

      expect(label.tagName).toEqual('LABEL');
      expect(label.innerHTML).toEqual(input.outerHTML + options.label);
      expect(label.className).toEqual(`${type}-inline`);

      expect(input.tagName).toEqual('INPUT');
      expect(input.type).toEqual(type);
    });
  });

  using([ 'radio', 'checkbox' ], type => {
    it('updates a bootstrap checkbox or radio', () => {
      const options = { label: 'b' };
      const $existing = document.createElement('label');

      renderers[type].update(options, $existing);

      expect($existing.textContent).toEqual('b');
    });
  });
});
