import './setup';
import * as schemas from '../../src/schemas/index';
import * as defaultOpts from '../../src/renderers/defaults';
import { Metadata } from '../../src/metadata';

describe('the metadata view model', () => {
  let sut;

  beforeEach(() => {
    sut = new Metadata();
  });

  it('instantiates the view model', () => {
    expect(sut.schema).toBeDefined();
    expect(sut.model).toBeDefined();
  });

  it('activates the view model by setting up the schema', () => {
    const schema = { };
    schemas.style = { type: schema };
    const model = { formStyle: 'style', elementType: 'type' };
    const defaultSpy = spyOn(defaultOpts, 'default');

    defaultSpy.and.returnValue({ a: 1 })

    sut.activate(model);

    expect(sut.schema).toBe(schema);
    expect(defaultSpy).toHaveBeenCalledWith('style', 'type');
    expect(sut.model).toEqual({
      a: 1,
      formStyle: 'style',
      elementType: 'type'
    });
  });
});
