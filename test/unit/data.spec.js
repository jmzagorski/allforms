import { Store } from 'aurelia-redux-plugin';
import { Router } from 'aurelia-router';
import { FormDataApi } from '../../src/api/index';
import { setupSpy } from './jasmine-helpers';
import { Data } from '../../src/data';
import * as formSelectors from '../../src/domain/form/selectors';

describe('the data view model', () => {
  let sut;
  let apiSpy;
  let routerSpy;
  let params;
  let getActiveFormSpy;
  let storeSpy;

  beforeEach(() => {
    storeSpy = setupSpy('store', Store.prototype);
    apiSpy = setupSpy('api', FormDataApi.prototype);
    routerSpy = setupSpy('router', Router.prototype);
    params = { formName: 'a', memberId: 'b' };
    getActiveFormSpy = spyOn(formSelectors, 'getActiveForm');

    sut = new Data(routerSpy, apiSpy, storeSpy);
  });

  it('initializes the view model with defaults', () => {
    expect(sut.dataList).toEqual([]);
    expect(sut.memberId).toBeDefined();
    expect(sut.gridOptions).toEqual({
      autoEdit: true,
      editable: true,
      forceFitColumns: true
    });
    expect(storeSpy.subscribe.calls.count()).toEqual(1);
  });

  it('initializes the memberId property on activate', async done => {
    await sut.activate(params);

    expect(sut.memberId).toEqual(params.memberId);
    done()
  });

  it('does not update the list without a form', async done => {
    await sut.activate(params);

    expect(apiSpy.getAll).not.toHaveBeenCalled();
    done()
  });

  it('get the form data list from the api on activate if a form exits', async done => {
    // skip the forEach and sort with the empty array
    const data = [];
    const form = { id: 1 };
    getActiveFormSpy.and.returnValue(form);
    apiSpy.getAll.and.returnValue(data);

    await sut.activate(params);

    expect(sut.dataList).toBe(data);
    expect(apiSpy.getAll).toHaveBeenCalledWith(1);
    done();
  });

  it('sorts the form data list by original id or id', async done => {
    const saved1 = new Date(2011,1,1);
    const saved2 = new Date(2012,1,1);
    const saved3 = new Date(2013,1,1);
    const saved4 = new Date(2014,1,1);

    const data = [
      { id: 1, saved: saved1 },
      { id: 4, originalId: 2, saved: saved2 },
      { id: 5, originalId: 2, saved: saved4 },
      { id: 2, saved: saved3 },
      { id: 3, originalId: 1, saved: saved4 }
    ];
    apiSpy.getAll.and.returnValue(data);
    getActiveFormSpy.and.returnValue({});

    await sut.activate(params);

    expect(sut.dataList[0].id).toEqual(2);
    expect(sut.dataList[1].id).toEqual(5);
    expect(sut.dataList[2].id).toEqual(4);
    expect(sut.dataList[3].id).toEqual(1);
    expect(sut.dataList[4].id).toEqual(3);
    done();
  });

  [ { data: [ { id: 1, name: 'first' }, { id: 2, name: 'second'} ], route: 'formData' },
    { data: [ { id: 1, name: 'first', originalId: 3 }, { id: 2, name: 'second', originalId: 3 } ], route: 'snapshot' }
  ].forEach(record => {
    it('generates a route for each existing data form', async done => {
      routerSpy.generate.and.returnValues('a', 'b', 'new');
      getActiveFormSpy.and.returnValue({ name: 'c' });
      apiSpy.getAll.and.returnValue(record.data);

      await sut.activate(params);

      // FIXME go through tests and make sure to test each arg or else this will
      // pass even though the object arg fails
      expect(routerSpy.generate.calls.argsFor(0)[0]).toEqual(record.route);
      expect(routerSpy.generate.calls.argsFor(0)[1]).toEqual({
        formName: 'c', formDataName: 'second', memberId: params.memberId
      });
      expect(routerSpy.generate.calls.argsFor(1)[0]).toEqual(record.route);
      expect(routerSpy.generate.calls.argsFor(1)[1]).toEqual({
        formName: 'c', formDataName: 'first', memberId: params.memberId
      });
      expect(sut.dataList[0].url).toEqual('a');
      expect(sut.dataList[1].url).toEqual('b');
      expect(routerSpy.generate.calls.count()).toEqual(3);
      done();
    });
  });

  it('adds an indent property to help formatting children', async done => {
    const data = [ { originalId: 1 }, { id: 2 }];
    apiSpy.getAll.and.returnValue(data);
    getActiveFormSpy.and.returnValue({});

    await sut.activate(params);

    expect(data[0]._indent).toEqual(1);
    expect(data[1]._indent).not.toBeDefined();
    done();
  });

  it('generates a route to create a new data form', async done => {
    const newRoute = {};
    // skiip the form
    getActiveFormSpy.and.returnValue(null);
    routerSpy.generate.and.returnValue(newRoute)

    await sut.activate(params);

    expect(sut.routeToNew).toBe(newRoute);
    expect(routerSpy.generate).toHaveBeenCalledWith('newData', {
      memberId: params.memberId, formName: params.formName
    });
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
    it('returns true or false based on parent expand property when showing snapshot', () => {
      const parent = { id: 2, _expanded: expanded, originalId: null };
      const item = { id: 3, _expanded: true, originalId: 2 };

      sut.dataList = [ parent, item ];

      const shouldShow = sut.showSnapshot(item);

      expect(shouldShow).toEqual(expanded);
    });
  });

  [ true, false ].forEach(expanded => {
    it('returns true or flase based on grandparent expand property', () => {
      const grandparent = { id: 1, _expanded: expanded, originalId: null };
      const parent = { id: 2, _expanded: true, originalId: 1 };
      const item = { id: 3, _expanded: true, originalId: 2 };

      sut.dataList = [ grandparent, parent, item ];

      const shouldShow = sut.showSnapshot(item);

      expect(shouldShow).toEqual(expanded);
    });
  });

  [ true, false ].forEach(expanded => {
    it('sets private _expanded field for the grid to the opposite value', () => {
      const item = { _expanded: expanded };

      sut.setExpanded(item);

      expect(item._expanded).toEqual(!expanded);
    });
  });
})
