import '../../setup';
import * as renderers from '../../../../src/renderers/bootstrap';

describe('the boostrap input renderer', () => {
  let sut;
  let options;

  beforeEach(() => {
    options = { text: 'a', id: "3", type: 'number' }
  })

  using([ 
    { method: 'number', type: 'number' },
    { method: 'attachments', type: 'file' },
    { method: 'date', type: 'text' },
    { method: 'text', type: 'text' } 
  ], data => {
    it('creates a bootstrap input type', () => {
      const sut = renderers[data.method].create(options);

      expect(sut.tagName).toEqual('DIV');
      expect(sut.className).toEqual('form-group');

      const label = sut.children[0];
      expect(label.tagName).toEqual('LABEL');
      expect(label.textContent).toEqual(options.text);
      expect(label.htmlfor).toEqual(options.id);

      const input = sut.children[1];
      expect(input.tagName).toEqual('INPUT');
      expect(input.id).toEqual(options.id);
      expect(input.type).toEqual(data.type);
      expect(input.className).toEqual('form-control');
    });
  });

  it('allows for multiple files', () => {
    const sut = renderers.attachments.create(options);

    expect(sut.getAttribute('multiple')).toBeTruthy();
  });

  it('updates the label on an attachment', () => {
    const $existing = renderers.attachments.create(options);
    const newLabel = options.text + 'a';
    options.text = newLabel;

    const $updated = renderers.attachments.update(options, $existing);;

    expect($updated).toBe($existing);
    expect($existing.textContent).toEqual(newLabel);
  });

  using([ 'number', 'date' ], type => {
    it('creates the max and min attribute on the number and date', () => {
      options.min = 1;
      options.max = 3;

      const sut = renderers[type].create(options);

      expect(sut.children[1].getAttribute('min')).toEqual('1');
      expect(sut.children[1].getAttribute('max')).toEqual('3');
    });
  });

  using([ 'number', 'date' ], type => {
    it('sets the max and min attribute on the number and date', () => {
      options.min = 1;
      options.max = 3;
      const $existing = renderers[type].create(options);
      options.min++;
      options.max++;

      renderers[type].update(options, $existing);

      expect($existing.children[1].getAttribute('min')).toEqual('2');
      expect($existing.children[1].getAttribute('max')).toEqual('4');
    });
  });

  it('creates the pattern attribute on the text', () => {
    options.min = 1;
    options.max = 3;

    const sut = renderers.text.create(options);

    expect(sut.children[1].getAttribute('pattern')).toEqual('.{1, 3}');
  });

  it('updates the pattern attribute on the text', () => {
    options.min = 1;
    options.max = 3;
    const $existing = renderers.text.create(options);
    options.min++;
    options.max++;

    renderers.text.update(options, $existing, );

    expect($existing.children[1].getAttribute('pattern')).toEqual('.{2, 4}');
  });
});
