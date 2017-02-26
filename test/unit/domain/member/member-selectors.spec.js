import '../../setup';
import * as selectors from '../../../../src/domain/member/member-selectors';

describe('the member selectors', () => {
  let state;

  it('returns the current member', () => {
    const member = {};
    const state = { member };

    const active = selectors.getActiveMember(state);

    expect(active).toBe(member);
  });
});
