import * as domain from '../../../../src/domain';

describe('the element reducer', () => {

  [ domain.RECEIVED_ELEMENT, domain.ELEMENT_ADDED, domain.ELEMENT_EDITED,
    domain.ELEMENT_DELETED
  ].forEach(type => {
    it('returns the original state on error for actions', () => {
      const state = {};
      const action = { type, error: true }

      const newState = domain.element(state, action);

      expect(newState).toBe(state);
    });
  });

  [ domain.RECEIVED_ELEMENT, domain.ELEMENT_ADDED, domain.ELEMENT_EDITED,
    domain.DEFAULT_NEW_ELEMENT
  ].forEach(type => {
    it('returns the payload for actions', () => {
      const payload = {};
      const action = { type, payload };

      const newState = domain.element(null, action);

      expect(newState).toBe(payload);
    });
  });

  it('returns the original state when no action type matches', () => {
    const state = [];
    const action = { type: '' };

    const newState = domain.element(state, action);

    expect(newState).toBe(state);
  });

  it('returns null when element is deleted', () => {
    const state = [];
    const action = { type: 'ELEMENT_DELETED' };

    const newState = domain.element(state, action);

    expect(newState).toEqual(null);
  });

  it('defaults the state to null', () => {
    const action = { type: '' };

    const newState = domain.element(undefined, action);

    expect(newState).toEqual(null);
  });
});
