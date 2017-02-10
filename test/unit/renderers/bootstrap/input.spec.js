import '../../setup';
import * as renderers from '../../../../src/renderers/bootstrap';

describe('the boostrap input renderer', () => {
  let sut;
  let options;

  beforeEach(() => {
    options = { name: 'a', id: "3", type: 'number', disabled: true }
  })

  using([ 
    { method: 'number', type: 'number' },
    { method: 'attachments', type: 'file' } 
  ], data => {
    it('creates a bootstrap input type', () => {
      const sut = renderers[data.method](options);

      expect(sut.tagName).toEqual('DIV');
      expect(sut.className).toEqual('form-group');

      const label = sut.children[0];
      expect(label.tagName).toEqual('LABEL');
      expect(label.textContent).toEqual(options.name);
      expect(label.htmlfor).toEqual(options.id);

      const input = sut.children[1];
      expect(input.tagName).toEqual('INPUT');
      expect(input.id).toEqual(options.id);
      expect(input.type).toEqual(data.type);
      expect(input.className).toEqual('form-control');
      expect(input.disabled).toEqual(options.disabled);
    });
  });

  it('allows for multiple files', () => {
    const sut = renderers.attachments(options);

    expect(sut.getAttribute('multiple')).toBeTruthy();
  });
});
