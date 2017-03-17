import * as formula from '../../../src/elements/formula';

describe('the formula element', () => {

  it('has bootstrap formula properties', () => {
    const sut = formula.bootstrap();

    expect(sut.text).toBeDefined();
    expect(sut.name).toBeDefined();
    expect(sut.type).toBeDefined();
    expect(sut.variables).toBeDefined();
    expect(sut.types).toEqual(['', 'info', 'success', 'danger', 'warning']);
    expect(sut.calculation).toBeDefined();
    expect(sut.schema).toBeDefined();
    expect(sut.schema).toContain('text.html');
    expect(sut.schema).toContain('name.html');
    expect(sut.schema).toContain('types.html');
    expect(sut.schema).toContain('formula.html');
  });

  [ { type: '', className: '' },
    { type: 'info', className: 'alert alert-info' }
  ].forEach(data => {
    it('creates the formula element', () => {
      const sut = formula.bootstrap();
      sut.text = 'a';
      sut.name = 'b';
      sut.type = data.type
      sut.variables = 'c d';
      sut.calculation = 5;

      const $elem = sut.create();

      expect($elem.tagName).toEqual('SPAN');
      expect($elem.className).toEqual(data.className);
      expect($elem.textContent).toEqual('a5');

      const $output = $elem.children[0];
      expect($output.tagName).toEqual('OUTPUT');
      expect($output.name).toEqual('b');
      expect($output.htmlfor).toEqual('c d');
    });
  });

  [ { type: '', className: '' },
    { type: 'info', className: 'alert alert-info' }
  ].forEach(data => {
    it('updates the formula element', () => {
      const sut = formula.bootstrap();
      sut.text = 'a';
      sut.name = 'b';
      sut.type = 'success';
      sut.variables = 'c d';
      sut.calculation = 5;
      const $elem = sut.create();
      sut.type = data.type;
      sut.text = 'c';
      sut.name = 'd';
      sut.variables = 'e f';
      sut.calculation = 7;

      const $updated = sut.create($elem);

      expect($updated).toBe($elem);
      expect($updated.className).toEqual(data.className);
      expect($updated.textContent).toEqual('c7');

      const $output = $updated.children[0];
      expect($output.name).toEqual('d');
      expect($output.htmlfor).toEqual('e f');
    });
  });
});
