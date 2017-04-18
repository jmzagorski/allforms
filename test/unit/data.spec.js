import { Router } from 'aurelia-router';
import { FormDataApi } from '../../src/api/index';
import { getFormData } from '../../src//domain/index';
import { setupSpy } from './jasmine-helpers';
import { Data } from '../../src/data';

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
    expect(sut.gridOptions).toEqual({
      autoEdit: true,
      editable: true,
      forceFitColumns: true
    });
  });

  it('get the form data list from the api on activate', async done => {
    const data= [];
    apiSpy.getAll.and.returnValue(data);

    await sut.activate(params);

    expect(sut.dataList).toBe(data);
    expect(apiSpy.getAll).toHaveBeenCalledWith(params.form);
    done();
  });

  it('sorts the form data list by original id or id', async done => {
    const saved1 = new Date(2011,1,1);
    const saved2 = new Date(2012,1,1);
    const saved3 = new Date(2013,1,1);
    const saved4 = new Date(2014,1,1);

    const data= [
      { id: 1, saved: saved1 },
      { id: 4, originalId: 2, saved: saved2 },
      { id: 5, originalId: 2, saved: saved4 },
      { id: 2, saved: saved3 },
      { id: 3, originalId: 1, saved: saved4 }
    ];
    apiSpy.getAll.and.returnValue(data);

    await sut.activate(params);

    expect(sut.dataList[0].id).toEqual(2);
    expect(sut.dataList[1].id).toEqual(5);
    expect(sut.dataList[2].id).toEqual(4);
    expect(sut.dataList[3].id).toEqual(1);
    expect(sut.dataList[4].id).toEqual(3);
    done();
  });

  it('generates a route to create a new data form', async done => {
    const data= [];
    const newRoute = {};
    apiSpy.getAll.and.returnValue(data);
    routerSpy.generate.and.returnValue(newRoute)

    await sut.activate(params);

    expect(sut.routeToNew).toBe(newRoute);
    expect(routerSpy.generate.calls.argsFor(0)).toEqual([ 'newData', { form: params.form } ]);
    done();
  });

  [ { data: [ { id: 1}, { id: 2} ], route: 'formData' },
    { data: [ { id: 1, originalId: 3 }, { id: 2, originalId: 3 } ], route: 'snapshot' }
  ].forEach(record => {
    it('generates a formData route for each existing data form', async done => {
      routerSpy.generate.and.returnValues('new', 'a', 'b');
      apiSpy.getAll.and.returnValue(record.data);

      await sut.activate(params);

      expect(routerSpy.generate.calls.argsFor(1)[0]).toEqual(
        record.route, { form: params.form, formDataId: 1 }
      );
      expect(routerSpy.generate.calls.argsFor(2)[0]).toEqual(
        record.route, { form: params.form, formDataId: 2 }
      );
      expect(sut.dataList[0].url).toEqual('a');
      expect(sut.dataList[1].url).toEqual('b');
      expect(routerSpy.generate.calls.count()).toEqual(3);
      done();
    });
  });

  it('adds an indent property to help formatting children', async done => {
    const data = [ { originalId: 1 }, { id: 2 }];
    apiSpy.getAll.and.returnValue(data);

    await sut.activate(params);

    expect(data[0]._indent).toEqual(1);
    expect(data[1]._indent).not.toBeDefined();
    done();
  });

  [ { method: 'snapshotSelected', api: 'snapshot' },
    { method: 'copySelected', api: 'copy' },
  ].forEach(data => {
    it('calls an api for each selected record', async done => {
      sut.capture({ id: 123 });
      sut.capture({ id: 124 });

      sut[data.method]();

      expect(apiSpy[data.api].calls.argsFor(0)).toEqual([ 123 ]);
      expect(apiSpy[data.api].calls.argsFor(1)).toEqual([ 124 ]);
      done();
    });
  });

  [ { method: 'snapshotSelected', api: 'snapshot' },
    { method: 'copySelected', api: 'copy' }
  ].forEach(data => {
    it('does not call any api when record is captured twice', async done => {
      const obj = { };
      sut.capture(obj);
      sut.capture(obj);

      sut[data.method]();

      expect(apiSpy[data.api]).not.toHaveBeenCalled();
      done();
    });
  });

  it('does not call the snapshot api when obj is a snapshot', async done => {
    const obj = { originalId: 1 };
    sut.capture(obj);

    sut.snapshotSelected();

    expect(apiSpy.snapshot).not.toHaveBeenCalled();
    done();
  });

  it('returns true when orignal id is missing', () => {
    const shouldShow = sut.showSnapshot({});

    expect(shouldShow).toBeTruthy();
  });

  [ true, false ].forEach(expanded => {
    it('returns based on parent expand property', () => {
      const parent = { id: 2, _expanded: expanded, originalId: null };
      const item = { id: 3, _expanded: true, originalId: 2 };

      sut.dataList = [ parent, item ];

      const shouldShow = sut.showSnapshot(item);

      expect(shouldShow).toEqual(expanded);
    });
  });

  [ true, false ].forEach(expanded => {
    it('returns based on grandparent expand property', () => {
      const grandparent = { id: 1, _expanded: expanded, originalId: null };
      const parent = { id: 2, _expanded: true, originalId: 1 };
      const item = { id: 3, _expanded: true, originalId: 2 };

      sut.dataList = [ grandparent, parent, item ];

      const shouldShow = sut.showSnapshot(item);

      expect(shouldShow).toEqual(expanded);
    });
  });

  [ true, false ].forEach(expanded => {
    it('sets private _expanded field to the opposite', () => {
      const item = { _expanded: expanded };

      sut.setExpanded(item);

      expect(item._expanded).toEqual(!expanded);
    });
  });
})
