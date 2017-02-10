import '../../setup';
import { iframe } from '../../../../src/renderers/bootstrap';

describe('the boostrap iframe renderer', () => {
  let sut;

  it('creates a bootstrap iframe', () => {
    const options = { href: 'hahababa', width: 100, height: 200 };

    const sut = iframe(options);

    expect(sut.tagName).toEqual('IFRAME');
    expect(sut.src).toContain('/hahababa');
    expect(sut.height).toEqual('200');
    expect(sut.width).toEqual('100');
  });
});
