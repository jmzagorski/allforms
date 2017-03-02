import '../../setup';
import { link } from '../../../../src/renderers/bootstrap';

describe('the boostrap link renderer', () => {
  let sut;

  it('creates a bootstrap link', () => {
    const options = { href: 'hahababa', text: 'a' };

    const sut = link.create(options);

    expect(sut.tagName).toEqual('A');
    expect(sut.href).toContain('/hahababa');
    expect(sut.textContent).toContain('a');
  });

  // don't want the click event when designing the form
  it('prevents the click event', () => {
    const options = { };
    const sut = link.create(options);

    const canceled = !sut.click();

    expect(canceled).toBeTruthy();
  });

  it('updates a bootstrap link', () => {
    const $existing = document.createElement('a');
    const options = { href: 'hahababa', text: 'a' };

    link.update(options, $existing);

    expect($existing.href).toContain('/hahababa');
    expect($existing.textContent).toContain('a');
  });
});
