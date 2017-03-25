import * as attachments from '../../../src/elements/attachments';

describe('the attachment element entity', () => {

  it('has bootstrap attachment properties', () => {
    const sut = attachments.bootstrap();

    expect(sut.text).toBeDefined();
    expect(sut.multiple).toBeFalsy();
    expect(sut.schema).toBeDefined();
    expect(sut.schema).toContain('text.html');
    expect(sut.schema).toContain('attachment.html');
  });

  [ { multiple: true, expect: '' }, { multiple: false, expect: null} ].forEach(data => {
    it('sets the multiple attribute on and off', () => {
      const sut = attachments.bootstrap();
      sut.multiple = data.multiple;

      const $elem = sut.create();

      expect($elem.children[1].getAttribute('multiple')).toEqual(data.expect);
    });
  });

  it('prevents the click', () => {
    const sut = attachments.bootstrap();
    const $elem = sut.create();

    const canceled = !$elem.click();

    expect(canceled).toBeTruthy();
  });
});
