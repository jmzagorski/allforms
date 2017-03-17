import * as label from '../../../src/elements/label';

describe('the label element entity', () => {

  it('has bootstrap label properties', () => {
    const sut = label.bootstrap();

    expect(sut.text).toBeDefined();
    expect(sut.type).toBeDefined();
    expect(sut.schema).toBeDefined();
    expect(sut.schema).toContain('text.html');
    expect(sut.schema).toContain('types.html');
  });

  it('creates a bootstrap label element', () => {
    const sut = label.bootstrap();
    sut.type = 'a';
    sut.text = 'g';

    const $elem = sut.create();

    expect($elem.tagName).toEqual('SPAN');
    expect($elem.className).toEqual('label label-a');
    expect($elem.textContent).toEqual('g');
    expect($elem.style.fontSize).toEqual('1em');
  });

  [ { className: '', type: 'a', expect: 'label label-a'},
    { className: 'test', type: 'b', expect: 'test label label-b'},
    { className: 'label label-b', type: 'd', expect: 'label label-d'}
  ].forEach(data => {
    it('creates a bootstrap label on another element', () => {
      const $existing = document.createElement('span');
      const sut = label.bootstrap();
      $existing.className = data.className;
      sut.type = data.type;
      sut.text = 'g';

      const $updated = sut.create($existing);

      expect($updated).toBe($existing);
      expect($updated.className).toEqual(data.expect);
      expect($updated.textContent).toEqual('g');
      expect($updated.style.fontSize).toEqual('1em');
    });
  });
});
