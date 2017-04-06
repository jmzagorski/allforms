import * as formula from '../../../src/elements/formula';

describe('the formula element', () => {

  it('has bootstrap formula properties', () => {
    const sut = formula.bootstrap();

    expect(sut.text).toBeDefined();
    expect(sut.name).toBeDefined();
    expect(sut.context).toBeDefined();
    expect(sut.relations).toEqual([]);
    expect(sut.contexts).toEqual(['', 'info', 'success', 'danger', 'warning']);
    expect(sut.value).toBeDefined();
    expect(sut.formula).toBeDefined();
    expect(sut.formId).toBeDefined();
    expect(sut.schema).toBeDefined();
    expect(sut.schema).toContain('text.html');
    expect(sut.schema).toContain('name.html');
    expect(sut.schema).toContain('contexts.html');
    expect(sut.schema).toContain('formula.html');
  });

  [ { type: '', className: '' },
    { type: 'info', className: 'alert alert-info' }
  ].forEach(data => {
    it('creates the formula element', () => {
      const sut = formula.bootstrap();
      sut.text = 'a';
      sut.name = 'b';
      sut.context = data.type
      sut.relations = [ { name: 'c' }, { name: 'd' } ]
      sut.value = 5;

      const $elem = sut.create();

      expect($elem.tagName).toEqual('SPAN');
      expect($elem.textContent).toEqual('a5');

      const $output = $elem.children[0];
      expect($output.className).toEqual(data.className);
      expect($output.tagName).toEqual('OUTPUT');
      expect($output.name).toEqual('b');
      expect($output.getAttribute('for')).toEqual('c d');
    });
  });

  [ { type: '', className: '' },
    { type: 'info', className: 'alert alert-info' }
  ].forEach(data => {
    it('updates the formula element', () => {
      const sut = formula.bootstrap();
      sut.text = 'a';
      sut.name = 'b';
      sut.context = 'success';
      sut.relations = { name: 'c' };
      sut.value = 5;
      const $elem = sut.create();
      sut.context = data.type;
      sut.text = 'c';
      sut.name = 'd';
      sut.relations = [];
      sut.value = 7;

      const $updated = sut.create($elem);

      expect($updated).toBe($elem);
      expect($updated.textContent).toEqual('c7');

      const $output = $updated.children[0];
      expect($output.className).toEqual(data.className);
      expect($output.name).toEqual('d');
      expect($output.getAttribute('for')).toEqual('');
    });
  });
});
