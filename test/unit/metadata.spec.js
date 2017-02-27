import './setup';
import * as schemas from '../../src/schemas/index';
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
    const model = { formStyle: 'bootstrap', elementType: 'ab' };
    const schema = [{ key: 'a', default: 1 }];
    schemas.bootstrap.ab = schema;

    sut.activate(model);

    expect(sut.schema).toBe(schema);
    expect(sut.model).toEqual({
      formStyle: 'bootstrap',
      elementType: 'ab',
      a: 1
    });
  });
});
