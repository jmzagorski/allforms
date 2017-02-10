import '../../setup';
import { link } from '../../../../src/renderers/bootstrap';

describe('the boostrap link renderer', () => {
  let sut;

  it('creates a bootstrap link', () => {
    const options = { href: 'hahababa', name: 'a' };

    const sut = link(options);

    expect(sut.tagName).toEqual('A');
    expect(sut.href).toContain('/hahababa');
    expect(sut.textContent).toContain('a');
  });

  // don't want the click event when designing the form
  it('prevents the click event', () => {
    const options = { };
    const sut = link(options);

    const canceled = !sut.click();

    expect(canceled).toBeTruthy();
  });
});
