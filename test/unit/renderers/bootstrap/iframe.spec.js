import '../../setup';
import { iframe } from '../../../../src/renderers/bootstrap';

describe('the boostrap iframe renderer', () => {
  let sut;

  it('creates a bootstrap iframe', () => {
    const options = { href: 'hahababa', width: 100, height: 200 };

    const $element = iframe.create(options);

    expect($element.tagName).toEqual('IFRAME');
    expect($element.src).toContain('/hahababa');
    expect($element.height).toEqual('200');
    expect($element.width).toEqual('100');
  });

  it('updates the iframe', () => {
    const $existing = document.createElement('iframe');
    const options = { href: 'hahababa', width: 100, height: 200 };

    iframe.update(options, $existing);

    expect($existing.src).toContain('/hahababa');
    expect($existing.height).toEqual('200');
    expect($existing.width).toEqual('100');
  });
});
