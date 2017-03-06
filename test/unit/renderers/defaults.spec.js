import '../setup';
import sut from '../../../src/renderers/defaults';
import * as schemas from '../../../src/schemas/global';


describe('the renderer factory', () => {

  it('throws when the schema cannot be found', () => {
    const ex = () => sut('notfound');

    expect(ex).toThrow(new Error('Cannot find element schema notfound'));
  });

  it('returns the schema defaults', () => {
    schemas.test = [{ default: 1, key: 'a' }];

    const result = sut('test');

    expect(result).toBeDefined();
    expect(result.a).toEqual(1);
  });
});
