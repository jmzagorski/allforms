import { member } from '../../../../src/domain/index';

describe('the member reducer', () => {
  var sut;

  it('returns the action member on load success', () => {
    const pMember = {};
    const action = {
      type: 'LOAD_MEMBER_SUCCESS',
      member: pMember
    };

    const state = member(null, action);

    expect(state).toBe(pMember);
  });

  it('returns the original state when no action type matches', () => {
    const state = [];
    const action = { type: '' };

    const newState = member(state, action);

    expect(newState).toBe(state);
  });
});


