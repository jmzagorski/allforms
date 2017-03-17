import create from '../../../src/elements/factory';

describe('the element factory', () => {

  [ { style: 'bootstrap', type: 'attachments' },
    { style: 'BOOTSTRAP', type: 'ATTACHMENTS'},
    { style: 'bootstrap', type: 'checkbox'},
    { style: 'BOOTSTRAP', type: 'CHECKBOX'},
    { style: 'bootstrap', type: 'date'},
    { style: 'BOOTSTRAP', type: 'DATE'},
    { style: 'standard', type: 'header'},
    { style: 'STANDARD', type: 'HEADER'},
    { style: 'standard', type: 'iframe'},
    { style: 'STANDARD', type: 'IFRAME'},
    { style: 'bootstrap', type: 'label'},
    { style: 'BOOTSTRAP', type: 'LABEL'},
    { style: 'standard', type: 'link'},
    { style: 'STANDARD', type: 'LINK'},
    { style: 'bootstrap', type: 'number'},
    { style: 'BOOTSTRAP', type: 'NUMBER'},
    { style: 'bootstrap', type: 'radio'},
    { style: 'BOOTSTRAP', type: 'RADIO'},
    { style: 'bootstrap', type: 'select'},
    { style: 'BOOTSTRAP', type: 'SELECT'},
    { style: 'bootstrap', type: 'tab'},
    { style: 'BOOTSTRAP', type: 'TAB'},
    { style: 'bootstrap', type: 'text'},
    { style: 'BOOTSTRAP', type: 'TEXT'},
    { style: 'bootstrap', type: 'textarea'},
    { style: 'BOOTSTRAP', type: 'TEXTAREA'}
  ].forEach(data => {
    it('loads a particular style', () => {
      const expectReturn = {};

      const creator = () => create(data.style, data.type);

      expect(creator).not.toThrow();
      expect(creator()).toBeDefined();
      expect(creator()).not.toEqual(null);
    });
  });
});
