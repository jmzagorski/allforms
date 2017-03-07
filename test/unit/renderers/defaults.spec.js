import '../setup';
import sut from '../../../src/renderers/defaults';
import * as schemas from '../../../src/schemas/index';

describe('the schema defaults', () => {

  it('returns null when style not found', () => {
    const result = sut('notfound');

    expect(result).toEqual(null);
  });

  it('returns null when stlye type not found', () => {
    schemas.test = {};

    const result = sut('test', 'notfound');

    expect(result).toEqual(null);
  });

  it('returns the schema defaults', () => {
    const schema = [ { default: 1, key: 'a' } ];
    schemas.test = { type: schema };

    const result = sut('test', 'type');

    expect(result).not.toEqual(null);
    expect(result.a).toEqual(1);
  });
});
