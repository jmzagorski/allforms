import '../../setup';
import * as renderers from '../../../../src/renderers/bootstrap';
import using from 'jasmine-data-provider';

describe('the option renderer', () => {
  let sut;

  using([ 'radio', 'checkbox' ], method => {
    it('creates a bootstrap checkbox or radio', () => {
      const options = { label: 'b' };

      const label = renderers[method](options);
      const input = label.children[0];

      expect(label.tagName).toEqual('LABEL');
      expect(label.innerHTML).toEqual(input.outerHTML + options.label);
      expect(label.className).toEqual(`${method}-inline`);

      expect(input.tagName).toEqual('INPUT');
      expect(input.type).toEqual(method);
    });
  });
});
