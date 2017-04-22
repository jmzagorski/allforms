import * as selectors from '../../../../src/domain/member/selectors';

describe('the member selectors', () => {
  let state;

  it('returns the current member', () => {
    const member = {};
    const state = { member };

    const active = selectors.getActiveMember(state);

    expect(active).toBe(member);
  });

  [ { member: null, expect: '' },
    { member: undefined, expect: '' },
    { member: { id: 'a' }, expect: 'a' }
  ].forEach(rec => {
    it('returns the current login id', () => {
      const state = { member: rec.member };

      const login = selectors.getLoginId(state);

      expect(login).toEqual(rec.expect);
    });
  });
});
