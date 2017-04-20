import * as selectors from '../../../../src/domain/metadata/selectors';

describe('the metadata selectors', () => {

  [ { metadata: null, expected: '' },
    { metadata: undefined, expected: '' },
    { metadata: { status: 'anything' }, expected: 'anything' }
  ].forEach(rec => {
    it('returns the metadata current sync status', () => {
      const state = { metadata: rec.metadata };

      const actual = selectors.getStatus(state);

      expect(actual).toBe(rec.expected);
    });
  });
});
