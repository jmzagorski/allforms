import '../../setup';
import * as renderers from '../../../../src/renderers/bootstrap';
import using from 'jasmine-data-provider';

describe('the option renderer', () => {
  let sut;

  using([
    { method: 'radio', inline: true, expectClass: 'radio-inline' },
    { method: 'radio', inline: false, expectClass: 'radio' },
    { method: 'checkbox', inline: true, expectClass: 'checkbox-inline' },
    { method: 'checkbox', inline: false, expectClass: 'checkbox' }
  ], data => {
    it('creates a bootstrap checkbox or radio', () => {
      const options = { name: 'b', type: 'radio', inline: data.inline };

      const sut = renderers[data.method](options);

      expect(sut.tagName).toEqual('DIV');
      expect(sut.className).toEqual(data.expectClass);

      const label = sut.children[0];
      const input = label.children[0];
      expect(label.tagName).toEqual('LABEL');
      expect(label.innerHTML).toEqual(options.name + input.outerHTML);

      expect(input.tagName).toEqual('INPUT');
      expect(input.type).toEqual(data.method);
      expect(input.name).toEqual(options.name);
    });
  });
});
