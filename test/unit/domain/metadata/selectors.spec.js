import * as selectors from '../../../../src/domain/metadata/selectors';

describe('the metadata selectors', () => {

  [ { metadata: null, expected: '' },
    { metadata: undefined, expected: '' },
    { metadata: { status: 'anything' }, expected: 'anything' }
  ].forEach(rec => {
    it('returns the metadata current sync status', () => {
      const state = { metadata: rec.metadata };

      const actual = selectors.getOverallMetadataStatus(state);

      expect(actual).toBe(rec.expected);
    });
  });

  [ { metadata: null, expected: null },
    { metadata: undefined, expected: null },
    { metadata: { statuses: 'anything' }, expected: 'anything' }
  ].forEach(rec => {
    it('returns the all metadata statuses', () => {
      const state = { metadata: rec.metadata };

      const actual = selectors.getAllMetadataStatuses(state);

      expect(actual).toBe(rec.expected);
    });
  });
});
