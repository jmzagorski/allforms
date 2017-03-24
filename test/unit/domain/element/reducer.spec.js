import * as domain from '../../../../src/domain/index';

describe('the element reducer', () => {

  [
    domain.RECEIVED_ELEMENT, domain.ELEMENT_ADDED, domain.ELEMENT_EDITED
  ].forEach(type => {
    it('returns the original state on error for actions', () => {
      const state = {};
      const action = { type, error: true }

      const newState = domain.element(state, action);

      expect(newState).toBe(state);
    });
  });

  [
    domain.RECEIVED_ELEMENT, domain.ELEMENT_ADDED, domain.ELEMENT_EDITED
  ].forEach(type => {
    it('returns the payload for actions', () => {
      const payload = {};
      const action = { type, payload };

      const newState = domain.element(null, action);

      expect(newState).toBe(payload);
    });
  });

  it('returns null when the element is being created', () => {
    const action = { type: 'CREATE_ELEMENT' };

    const newState = domain.element(null, action);

    expect(newState).toEqual(null);
  });

  it('returns the original state when no action type matches', () => {
    const state = [];
    const action = { type: '' };

    const newState = domain.element(state, action);

    expect(newState).toBe(state);
  });
});
