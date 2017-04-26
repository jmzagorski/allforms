import { FormDataApi } from '../../src/api';
import { Dashboard } from '../../src/dashboard';
import { setupSpy } from './jasmine-helpers';
import * as utils from '../../src/utils';

describe('the dashboard view model', () => {
  let sut;
  let apiSpy;

  beforeEach(() => {
    apiSpy = setupSpy('api', FormDataApi.prototype);
    sut = new Dashboard(apiSpy);

    // bypass theh logic for the data forms
    apiSpy.getAll.and.returnValue([]);
  });

  it('initializes the view model', () => {
    expect(sut.dataList).toEqual([]);
    expect(sut.dataFormProps).toEqual([]);
    expect(sut.gridOptions).toEqual({ forceFitColumns: true });
  });

  it('calls the form data api on activate', async done => {
    await sut.activate({ id: 1 });

    expect(apiSpy.getAll.calls.count()).toEqual(1);
    expect(apiSpy.getAll).toHaveBeenCalledWith(1);
    done();
  });

  it('creates the grid columns from data form properties', async done => {
    const dataForms = [
      { data: { id: 1, whatever: 'a' } },
      { data: { id: 2, whatever: 'b' } }
    ];
    apiSpy.getAll.and.returnValue(dataForms);

    await sut.activate({ id: 1 });

    // must be first, just so it is easier for the user to see the form!
    expect(sut.dataFormProps[0]).toEqual('form');
    expect(sut.dataFormProps[1]).toEqual('id');
    expect(sut.dataFormProps[2]).toEqual('whatever');
    done();
  });

  it('populates the view model data list from the api', async done => {
    const dataForms = [
      { name: 'c', data: { id: 1, whatever: 'a' } },
      { name: 'e', data: { id: 2, whatever: 'b' } }
    ];
    apiSpy.getAll.and.returnValue(dataForms);

    await sut.activate({ id: 1 });

    // must be first, just so it is easier for the user to see the form!
    expect(sut.dataList).toEqual([
      { form: 'c', id: 1, whatever: 'a' },
      { form: 'e', id: 2, whatever: 'b' }
    ]);
    done();
  });

  it('joins array values with a bar', async done => {
    const dataForms = [ { name: 'c', data: { id: [ 1, 2 ] } } ];
    apiSpy.getAll.and.returnValue(dataForms);
    spyOn(utils, 'isArray').and.returnValue(true);

    await sut.activate({ id: 1 });

    // must be first, just so it is easier for the user to see the form!
    expect(sut.dataList).toEqual([
      { form: 'c', id: '1 & 2' },
    ]);
    done();
  });
});
