import { Router } from 'aurelia-router';
import { FormDataApi } from '../../src/api/index';
import { getFormData } from '../../src//domain/index';
import { setupSpy } from './jasmine-helpers';
import { Data} from '../../src/data';

describe('the data view model', () => {
  let sut;
  let apiSpy;
  let routerSpy;
  let params;

  beforeEach(() => {
    apiSpy = setupSpy('api', FormDataApi.prototype);
    routerSpy = setupSpy('router', Router.prototype);
    params = { form: 1 };

    sut = new Data(routerSpy, apiSpy);
  });

  it('initializes the view model with defaults', () => {
    expect(sut.dataList).toEqual([]);
  })

  it('get the form data list from the api on activate', async done => {
    const data= [];
    apiSpy.getAll.and.returnValue(data);

    await sut.activate(params);
  
    expect(sut.dataList).toBe(data);
    expect(apiSpy.getAll).toHaveBeenCalledWith(params.form);
    done();
  });

  it('generates a route to create a new data form', async done => {
    const data= {};
    routerSpy.generate.and.returnValue(data);

    await sut.activate(params);
  
    expect(sut.routeToNew).toBe(data);
    expect(routerSpy.generate).toHaveBeenCalledWith('newData', { form: params.form });
    done();
  });

  it('generates a route for each existing data form', async done => {
    const data = [ { id: 1}, { id: 2 } ];
    routerSpy.generate.and.returnValues('new', 'a', 'b');
    apiSpy.getAll.and.returnValue(data);

    await sut.activate(params);
  
    expect(routerSpy.generate.calls.argsFor(1)[0]).toEqual(
      'formData', { form: params.form, formDataId: 1 }
    );
    expect(routerSpy.generate.calls.argsFor(2)[0]).toEqual(
      'formData', { form: params.form, formDataId: 2 }
    );
    expect(sut.dataList[0].url).toEqual('a');
    expect(sut.dataList[1].url).toEqual('b');
    done();
  });
})
