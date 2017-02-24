import '../../setup';
import * as renderers from '../../../../src/renderers/bootstrap';

describe('the boostrap input renderer', () => {
  let sut;
  let options;

  beforeEach(() => {
    options = { label: 'a', id: "3", type: 'number' }
  })

  using([ 
    { method: 'number', type: 'number' },
    { method: 'attachments', type: 'file' },
    { method: 'date', type: 'text' },
    { method: 'text', type: 'text' } 
  ], data => {
    it('creates a bootstrap input type', () => {
      const sut = renderers[data.method](options);

      expect(sut.tagName).toEqual('DIV');
      expect(sut.className).toEqual('form-group');

      const label = sut.children[0];
      expect(label.tagName).toEqual('LABEL');
      expect(label.textContent).toEqual(options.label);
      expect(label.htmlfor).toEqual(options.id);

      const input = sut.children[1];
      expect(input.tagName).toEqual('INPUT');
      expect(input.id).toEqual(options.id);
      expect(input.type).toEqual(data.type);
      expect(input.className).toEqual('form-control');
    });
  });

  it('allows for multiple files', () => {
    const sut = renderers.attachments(options);

    expect(sut.getAttribute('multiple')).toBeTruthy();
  });

  using([ 'number', 'date' ], method => {
    it('sets the max and min attribute on the number and date', () => {
      options.min = 1;
      options.max = 3;

      const sut = renderers[method](options);

      expect(sut.children[1].getAttribute('min')).toEqual('1');
      expect(sut.children[1].getAttribute('max')).toEqual('3');
    });
  });

  it('sets the pattern attribute on the text', () => {
    options.min = 1;
    options.max = 3;

    const sut = renderers.text(options);

    expect(sut.children[1].getAttribute('pattern')).toEqual('.{1, 3}');
  });
});
