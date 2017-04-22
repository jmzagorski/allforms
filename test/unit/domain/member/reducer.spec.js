import * as domain from '../../../../src/domain';

describe('the member reducer', () => {

  it('returns the payload on received member', () => {
    const payload = {};
    const state ={};
    const action = {
      type: domain.RECEIVED_CURRENT_MEMBER,
      payload
    };

    const newState = domain.member(state, action);

    expect(newState).toBe(payload);
  });

  it('returns the original state on error', () => {
    const state ={};
    const action = {
      type: domain.RECEIVED_CURRENT_MEMBER,
      error: true
    };

    const newState = domain.member(state, action);

    expect(newState).toBe(state);
  });

  it('returns the default when no action type matched', () => {
    const state ={};
    const action = { type: '' };

    const newState = domain.member(state, action);

    expect(newState).toBe(state);
  });
});
