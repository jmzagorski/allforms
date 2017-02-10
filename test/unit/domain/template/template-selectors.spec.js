import '../../setup';
import * as selectors from '../../../../src/domain/template/template-selectors';

describe('the template selectors', () => {

  using([
    { template: null, expect: ''},
    { template: undefined, expect: ''},
    { template: 'a', expect: 'a'},
  ], data => {
    it('returns the template from the state or an empty string', () => {
      const state = { template: data.template };

      const actual = selectors.getTemplate(state);

      expect(actual).toBe(data.expect);
    });
  });
});
