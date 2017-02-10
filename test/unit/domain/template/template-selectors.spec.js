import '../../setup';
import * as selectors from '../../../../src/domain/template/template-selectors';

describe('the template selectors', () => {

  it('returns the template from the state or an empty string', () => {
    const template = {};
    const state = { template };

    const actual = selectors.getTemplate(state);

    expect(actual).toBe(template);
  });
});
