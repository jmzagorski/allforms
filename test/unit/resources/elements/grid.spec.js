// IMPORTANT. don't mock TaskQueue unless you have to. I was having trouble
// passing the dataChanged method when it was mocked.

import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper-webpack';
import { GridFactory } from '../../../../src/resources/elements/grid-factory';
// need this for the integration tests for the <grid-column> as a child
import { TaskQueue } from 'aurelia-framework';
import { Grid, Data, Slick } from 'slickgrid-es6';
import { setupSpy } from '../../jasmine-helpers';

describe('the grid custom element', () => {
  let sut;
  let factorySpy;
  let queueMock;
  let gridSpy;
  let dataViewSpy;
  let subscribeSpy;
  // make a slickgrid spy, it is easier than mocking all functions
  let $grid;
  let gridFactoryMock;

  beforeEach(() => {
    $grid = document.createElement('div')
    $grid.id = 'my-slickgrid';
    document.body.appendChild($grid);

    const sg = new Grid('#my-slickgrid', [], [], []);
    const db = new Data.DataView();

    gridSpy = setupSpy('grid', sg);
    dataViewSpy = setupSpy('view', db);
    factorySpy = jasmine.createSpy('factory');
    queueMock = setupSpy('queue', TaskQueue.prototype)
    gridFactoryMock = { create: factorySpy }
    sut = StageComponent.withResources('resources/elements/grid');

    sut.configure = aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(GridFactory, gridFactoryMock);
      //aurelia.container.registerInstance(TaskQueue, queueMock);
    };

    factorySpy.and.returnValue(gridSpy);
    gridSpy.getData.and.returnValue(dataViewSpy);
    dataViewSpy.onRowCountChanged = setupSpy('event', new Slick.Event());
    dataViewSpy.onRowsChanged = setupSpy('event', new Slick.Event());
    gridSpy.onClick = setupSpy('event', new Slick.Event());
    gridSpy.onCellChange = setupSpy('event', new Slick.Event());
    gridSpy.getContainerNode.and.returnValue($grid);

    queueMock.queueTask.and.callFake(init => init());
  });

  afterEach(() => {
    if(sut.host.parentNode) sut.dispose();
    document.body.removeChild($grid);
  });

  it('has a div with the grid id', async done => {
    sut.inView(`<grid></grid>`);

    // do nothing
    //queueMock.queueTask.and.callFake(init => {});

    await sut.create(bootstrap);

    const div = sut.element.querySelector('#data-grid');

    expect(div).not.toEqual(null)
    done();
  });

  it('queues up an initialization task', async done => {
    sut.configure = aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(GridFactory, gridFactoryMock);
      aurelia.container.registerInstance(TaskQueue, queueMock);
    };

    let init = null
    sut.inView(`<grid></grid>`);

    // do nothing
    queueMock.queueTask.and.callFake(init => {});

    await sut.create(bootstrap);

    expect(queueMock.queueTask).toHaveBeenCalled();
    done();
  });

  [ { pk: '2', data: null},
    { pk: null, data: [ { id: 1 }] },
    { pk: undefined, data: [ { id: 1 }] },
    { pk: '', data: [ { id: 1 }] }
  ].forEach(rec => {
    it('calls the grid factory on initialize', async done => {
      const options = {};
      const context = { data: rec.data, id: 1, options, pk: rec.pk };

      sut.inView(`<grid data.bind="data" id.bind="id" options.bind="options" pk.bind="pk"></grid>`)
        .boundTo(context);

      await sut.create(bootstrap);

      expect(factorySpy).toHaveBeenCalledWith({
        gridId: '#1',
        pk: rec.pk,
        columnOptions: [ ],
        gridOptions: options,
        data: rec.data
      })
      expect(factorySpy.calls.argsFor(0)[0].gridOptions).toBe(options);
      done();
    });
  });

  // not sure how to test with @children. it was not wokrin
  // when icnluded <grid-column> in view
  it('creates the grid with grid-column children', async done => {
    sut.configure = aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(GridFactory, gridFactoryMock);
      aurelia.container.registerInstance(TaskQueue, queueMock);
    };

    let init = null
    const $elem = document.createElement('div');
    sut.inView(`<grid></grid>`)

    // defer init so i can add stubs to the columns
    queueMock.queueTask.and.callFake(fn => init = fn);

    await sut.create(bootstrap);

    sut.viewModel.columns = [ { options: 1, element: $elem } ];
    init();

    expect(factorySpy.calls.argsFor(0)[0].columnOptions).toEqual([1]);
    done();
  });

  it('sets the default grid height to 500px', async done => {
    sut.inView(`<grid></grid>`);

    await sut.create(bootstrap);

    expect($grid.style.height).toEqual('500px');
    done();
  });

  it('resizes the div to fit within the parent', async done => {
    sut.inView(`<grid height.bind="height"></grid>`)
      .boundTo({ height: 50 });

    await sut.create(bootstrap);

    const expectWidth = sut.element.parentNode.offsetWidth - 1;

    expect($grid.style.width).toEqual(expectWidth + 'px');
    expect($grid.style.height).toEqual('50px');
    expect(gridSpy.resizeCanvas).toHaveBeenCalled();
    done();
  });

  it('renders the grid when no pk is bound', async done => {
    const context = { data: [ { blah: 1 } ] };

    sut.inView(`<grid data.bind="data"></grid>`).boundTo(context);

    await sut.create(bootstrap);

    expect(gridSpy.setData).toHaveBeenCalledWith(context.data);
    expect(gridSpy.render.calls.count()).toEqual(1);
    expect(dataViewSpy.beginUpdate).not.toHaveBeenCalled();
    done()
  });

  it('re-renders the grid on data changed', async done => {
    const context = { data: { blah: 1 } };

    sut.inView(`<grid data.bind="data"></grid>`).boundTo(context);

    await sut.create(bootstrap);
      
    context.data = { blah: 2 };

    setTimeout(() => {
      expect(gridSpy.setData.calls.count()).toEqual(2);
      expect(gridSpy.render.calls.count()).toEqual(2);
      done()
    });
  });

  it('updates the dataView if a pk is given', async done => {
    dataViewSpy.beginUpdate.and.callFake(() => {
      expect(dataViewSpy.setItems).not.toHaveBeenCalled();
      expect(dataViewSpy.setFilter).not.toHaveBeenCalled();
      expect(dataViewSpy.endUpdate).not.toHaveBeenCalled();
    });

    dataViewSpy.endUpdate.and.callFake(() => {
      expect(dataViewSpy.setItems).toHaveBeenCalled();
      expect(dataViewSpy.setFilter).toHaveBeenCalled();
      // make sure events are registered after the update
      expect(dataViewSpy.onRowsChanged.subscribe).not.toHaveBeenCalled();
    });

    const context = { data: [] };

    sut.inView(`<grid pk="blah" data.bind="data"></grid>`).boundTo(context);

    await sut.create(bootstrap);

    expect(dataViewSpy.beginUpdate.calls.count()).toEqual(1);
    expect(dataViewSpy.setFilter.calls.count()).toEqual(1);
    expect(dataViewSpy.setItems.calls.count()).toEqual(1);
    expect(dataViewSpy.setItems.calls.argsFor(0)[0]).toBe(context.data);
    expect(dataViewSpy.endUpdate.calls.count()).toEqual(1);
    done();
  });

  it('subscribes to dataview row count changed event', async done => {
    let handler = null;

    dataViewSpy.onRowCountChanged.subscribe.and.callFake(h => handler = h);

    sut.inView(`<grid pk="blah"></grid>`);

    await sut.create(bootstrap);
    handler();

    expect(gridSpy.updateRowCount.calls.count()).toEqual(1);
    expect(gridSpy.render.calls.count()).toEqual(1);
    done();
  });

  it('subscribes to dataview rows changed event', async done => {
    let handler = null;

    dataViewSpy.onRowsChanged.subscribe.and.callFake(h => handler = h);

    sut.inView(`<grid pk="blah"></grid>`);

    await sut.create(bootstrap);
    handler(null, { rows: 2 });

    expect(gridSpy.invalidateRows.calls.count()).toEqual(1);
    expect(gridSpy.invalidateRows.calls.argsFor(0)[0]).toEqual(2);
    expect(gridSpy.render.calls.count()).toEqual(1);
    done();
  });

  it('listens for item changed event on the columns', async done => {
    sut.configure = aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(GridFactory, gridFactoryMock);
      aurelia.container.registerInstance(TaskQueue, queueMock);
    };

    let init = null
    const item = { id: 1 };
    const $elem = document.createElement('div');
    sut.inView(`<grid pk="id"></grid>`)

    // defer init so i can add stubs to the columns
    queueMock.queueTask.and.callFake(fn => init = fn);

    await sut.create(bootstrap);

    sut.viewModel.columns = [ { element: $elem } ];
    init();

    $elem.dispatchEvent(new CustomEvent('itemchanged', {
      bubles: true, detail: item
    }));

    expect(dataViewSpy.updateItem.calls.count()).toEqual(1);
    expect(dataViewSpy.updateItem.calls.argsFor(0)[0]).toEqual(1)
    expect(dataViewSpy.updateItem.calls.argsFor(0)[1]).toBe(item)
    done();
  });

  it('registers any grid events from the columns', async done => {
    sut.configure = aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(GridFactory, gridFactoryMock);
      aurelia.container.registerInstance(TaskQueue, queueMock);
    };

    let init = null;
    const clickFn = () => {};
    const changeFn = () => {};
    const subs = { onClick: clickFn, onCellChange: changeFn };
    sut.inView(`<grid></grid>`);

    // defer init so i can add stubs to the columns
    queueMock.queueTask.and.callFake(fn => init = fn);

    await sut.create(bootstrap);

    sut.viewModel.columns = [{
      element: document.createElement('div'),
      subscriptions: subs
    }];

    init();

    expect(gridSpy.onClick.subscribe.calls.count()).toEqual(1);
    expect(gridSpy.onClick.subscribe).toHaveBeenCalledWith(clickFn);
    expect(gridSpy.onCellChange.subscribe.calls.count()).toEqual(1);
    expect(gridSpy.onCellChange.subscribe).toHaveBeenCalledWith(changeFn);
    done();
  });

  it('destroys the grid on detached', async done => {
    sut.inView(`<grid></grid>`);

    await sut.create(bootstrap);

    sut.dispose();

    expect(gridSpy.destroy.calls.count()).toEqual(1);
    done();
  });

  it('unsubscribes to all subscriptions', async done => {
    sut.configure = aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(GridFactory, gridFactoryMock);
      aurelia.container.registerInstance(TaskQueue, queueMock);
    };

    let init = null;
    sut.inView(`<grid pk="blah"></grid>`);

    queueMock.queueTask.and.callFake(fn => init = fn);

    await sut.create(bootstrap);

    sut.viewModel.columns = [{
      element: document.createElement('div'),
      subscriptions: { onClick: () => {} }
    }];

    init();

    sut.dispose();

    expect(gridSpy.onClick.unsubscribe.calls.count()).toEqual(1);
    expect(dataViewSpy.onRowsChanged.unsubscribe.calls.count()).toEqual(1);
    expect(dataViewSpy.onRowCountChanged.unsubscribe.calls.count()).toEqual(1);
    done();
  });

  it('removes the column itemchange listener on dispose', async done => {
    sut.configure = aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(GridFactory, gridFactoryMock);
      aurelia.container.registerInstance(TaskQueue, queueMock);
    };

    let init = null
    const $elem = document.createElement('div');
    sut.inView(`<grid pk="id"></grid>`)

    // defer init so i can add stubs to the columns
    queueMock.queueTask.and.callFake(fn => init = fn);

    await sut.create(bootstrap);
    sut.viewModel.columns = [ { element: $elem } ];
    init();

    sut.dispose();

    $elem.dispatchEvent(new CustomEvent('itemchanged', {
      bubles: true, detail: {}
    }));

    expect(dataViewSpy.updateItem.calls.count()).toEqual(0);
    done();
  });
});
