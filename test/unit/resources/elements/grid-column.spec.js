import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper-webpack';
import { GridCustomElement } from '../../../../src/resources/elements/grid';
import Formatters from '../../../../src/resources/elements/grid-formatters';
import { Editors, Grid } from 'slickgrid-es6';
import { BindingEngine } from 'aurelia-framework';

describe('the grid custom element', () => {
  let sut;
  let gridMock;
  let bindingMock;
  let unsubscribeSpy;

  beforeEach(() => {
    unsubscribeSpy = jasmine.createSpy('unsubscribe');
    bindingMock = {
      propertyObserver: jasmine.createSpy('observer'),
      subscribe: jasmine.createSpy('subscribe')
    };
    gridMock = {
      grid: {
        getColumns: jasmine.createSpy('getColumns'),
        setColumns: jasmine.createSpy('setColumns'),
        getData: jasmine.createSpy('getData'),
        onClick: {
          subscribe: jasmine.createSpy('clicksub'),
          unsubscribe: jasmine.createSpy('clickunsub'),
        },
        onCellChange: {
          subscribe: jasmine.createSpy('changesub'),
          unsubscribe: jasmine.createSpy('changeunsub'),
        }
      },
      addColumn: jasmine.createSpy('addColumn')
    };

    bindingMock.propertyObserver.and.returnValue(bindingMock)
    bindingMock.subscribe.and.returnValue({
      dispose: unsubscribeSpy
    });

    sut = StageComponent.withResources('resources/elements/grid-column');

    sut.configure = aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(GridCustomElement, gridMock);
      aurelia.container.registerInstance(BindingEngine, bindingMock);
    };
  });

  afterEach(() => {
    if(sut.host.parentNode) sut.dispose();
  });

  it('subscribes to the firstElementChild change', async done => {
    sut.inView(`<grid-column></grid-column>`)

    await sut.create(bootstrap);

    expect(bindingMock.propertyObserver.calls.argsFor(0)[0]).toBe(sut.element);
    expect(bindingMock.propertyObserver.calls.argsFor(0)[1]).toEqual('firstElementChild');
    done();
  });

  it('updates the column html prop with the slot with any ', async done => {
    const column = { field: 'id', formatter: null, formatterOpts: {} };
    let slotFn = null;
    sut.inView(`<grid-column field.bind="field"><span></span></grid-column>`)
      .boundTo({ field: 'id' })
    bindingMock.subscribe.and.callFake(fn => {
      slotFn = fn;
      return { dispose: () => {} };
    });
    gridMock.grid.getColumns.and.returnValue([ column, { field: 'b' }])
    await sut.create(bootstrap);

    slotFn();

    expect(column.formatterOpts.html).toEqual('<span></span>');
    expect(column.formatter).toBe(Formatters.Html);
    expect(gridMock.grid.setColumns.calls.argsFor(0)[0]).toContain(column);
    expect(gridMock.grid.setColumns.calls.argsFor(0)[0]).toContain({ field: 'b'});
    done();
  });

  it('sets all properties with no all options set', async done => {
    const context = {
      asyncPostRender: '1',
      behavior: '2',
      cannotTriggerInsert: '3',
      cssClass: '4',
      defaultSortAsc: '5',
      editor: 'Checkmark',
      field: '7', 
      focusable: '8',
      formatter: 'Html',
      headerCssClass: '10',
      id: '11',
      maxWidth: '12',
      minWidth: '13',
      name: '14',
      rerenderOnResize: '15',
      resizable: '16',
      selectable: '17',
      sortable: '18',
      tooltip: '19',
      width: '20'
    }

    sut.inView(`<grid-column async-post-render.bind="asyncPostRender"
      behavior.bind="behavior"
      cannot-trigger-insert.bind="cannotTriggerInsert"
      css-class.bind="cssClass"
      default-sort-asc.bind="defaultSortAsc"
      editor.bind="editor"
      field.bind="field",
      focusable.bind="focusable"
      formatter.bind="formatter"
      header-css-class.bind="headerCssClass"
      id.bind="id"
      max-width.bind="maxWidth"
      min-width.bind="minWidth"
      name.bind="name"
      rerender-on-resize.bind="rerenderOnResize"
      resizable.bind="resizable"
      selectable.bind="selectable"
      sortable.bind="sortable"
      tooltip.bind="tooltip"
      width.bind="width"
    ></grid-column>`).boundTo(context);

    await sut.create(bootstrap);

    expect(gridMock.addColumn).toHaveBeenCalledWith({
      asyncPostRender: context.asyncPostRender,
      behavior: context.behavior,
      cannotTriggerInsert: context.cannotTriggerInsert,
      cssClass: context.cssClass,
      defaultSortAsc: context.defaultSortAsc,
      editor: Editors.Checkmark,
      field: context.field, 
      focusable: context.focusable,
      formatter: Formatters.Html,
      headerCssClass: context.headerCssClass,
      id: context.id,
      maxWidth: context.maxWidth,
      minWidth: context.minWidth,
      name: context.name,
      rerenderOnResize: context.rerenderOnResize,
      resizable: context.resizable,
      selectable: context.selectable,
      sortable: context.sortable,
      tooltip: context.tooltip,
      width: context.width
    });
    done();
  });

  it('sets id and name from field from  missing', async done => {
    const context = { field: 'abc' }

    sut.inView(`<grid-column field.bind="field"></grid-column>`)
      .boundTo(context);

    await sut.create(bootstrap);

    expect(gridMock.addColumn.calls.argsFor(0)[0].field).toEqual(context.field);
    expect(gridMock.addColumn.calls.argsFor(0)[0].id).toEqual(context.field);
    expect(gridMock.addColumn.calls.argsFor(0)[0].name).toEqual('Abc');
    done();
  });

  it('overrides individual field with all options', async done => {
    const context = {
      asyncPostRender: '1',
      behavior: '2',
      cannotTriggerInsert: '3',
      cssClass: '4',
      defaultSortAsc: '5',
      editor: '6',
      field: '7', 
      focusable: '8',
      formatter: '9',
      headerCssClass: '10',
      id: '11',
      maxWidth: '12',
      minWidth: '13',
      name: '14',
      rerenderOnResize: '15',
      resizable: '16',
      selectable: '17',
      sortable: '18',
      tooltip: '19',
      width: '20',
      allOptions: {
        asyncPostRender: '2',
        behavior: '3',
        cannotTriggerInsert: '4',
        cssClass: '5',
        defaultSortAsc: '6',
        editor: 'Checkmark',
        field: '8', 
        focusable: '9',
        formatter: 'Html',
        headerCssClass: '11',
        id: '12',
        maxWidth: '13',
        minWidth: '14',
        name: '15',
        rerenderOnResize: '16',
        resizable: '17',
        selectable: '18',
        sortable: '19',
        tooltip: '20',
        width: '21',
      }
    }

    sut.inView(`<grid-column all-options.bind="allOptions"
      async-post-render.bind="asyncPostRender"
      behavior.bind="behavior"
      cannot-trigger-insert.bind="cannotTriggerInsert"
      css-class.bind="cssClass"
      default-sort-asc.bind="defaultSortAsc"
      editor.bind="editor"
      field.bind="field"
      focusable.bind="focusable"
      formatter.bind="formatter"
      header-css-class.bind="headerCssClass"
      id.bind="id"
      max-width.bind="maxWidth"
      min-width.bind="minWidth"
      name.bind="name"
      rerender-on-resize.bind="rerenderOnResize"
      resizable.bind="resizable"
      selectable.bind="selectable"
      sortable.bind="sortable"
      tooltip.bind="tooltip"
      width.bind="width"
    ></grid-column>`).boundTo(context);

    await sut.create(bootstrap);

    expect(gridMock.addColumn).toHaveBeenCalledWith({
      asyncPostRender: context.allOptions.asyncPostRender,
      behavior: context.allOptions.behavior,
      cannotTriggerInsert: context.allOptions.cannotTriggerInsert,
      cssClass: context.allOptions.cssClass,
      defaultSortAsc: context.allOptions.defaultSortAsc,
      editor: 'Checkmark',
      field: context.allOptions.field, 
      focusable: context.allOptions.focusable,
      formatter: 'Html',
      headerCssClass: context.allOptions.headerCssClass,
      id: context.allOptions.id,
      maxWidth: context.allOptions.maxWidth,
      minWidth: context.allOptions.minWidth,
      name: context.allOptions.name,
      rerenderOnResize: context.allOptions.rerenderOnResize,
      resizable: context.allOptions.resizable,
      selectable: context.allOptions.selectable,
      sortable: context.allOptions.sortable,
      tooltip: context.allOptions.tooltip,
      width: context.allOptions.width
    });
    done();
  });

  [ { cell: 0, calls: 1 },
    { cell: 1, calls: 0}
  ].forEach(data => {
    it('subscribes to column events', async done => {
      let clickCb = null;
      let changeCb = null;
      const item = {};
      const getItemSpy = jasmine.createSpy('getItem').and.returnValue(item);
      const context = {
        click: jasmine.createSpy('clickcb'),
        change: jasmine.createSpy('changecb')
      };

      gridMock.grid.onClick.subscribe.and.callFake(cb => clickCb = cb);
      gridMock.grid.onCellChange.subscribe.and.callFake(cb => changeCb = cb);
      gridMock.grid.getData.and.returnValue({ getItem: getItemSpy });

      sut.inView(`<grid-column on-click.bind="click" on-cell-change.bind="change">
        </grid-column>`).boundTo(context);

      await sut.create(bootstrap);

      clickCb({}, { cell: data.cell, row: 1, grid: gridMock.grid })
      changeCb({}, { cell: data.cell, row: 1, grid: gridMock.grid })

      expect(context.change.calls.count()).toEqual(data.calls);
      expect(context.click.calls.count()).toEqual(data.calls);

      if (data.calls !== 0) {
        expect(context.change.calls.argsFor(0)[0]).toBe(item);
        expect(getItemSpy).toHaveBeenCalledWith(1);
      }

      done();
    });
  });

  it('removes all subscriptions on dispose', async done => {
    let clickCb = null;
    let changeCb = null;
    const context = {
      click: jasmine.createSpy('clickcb'),
      change: jasmine.createSpy('changecb')
    };

    gridMock.grid.onClick.subscribe.and.callFake(cb => clickCb = cb);
    gridMock.grid.onCellChange.subscribe.and.callFake(cb => changeCb = cb);

    sut.inView(`<grid-column on-click.bind="click" on-cell-change.bind="change">
      </grid-column>`).boundTo(context);

    await sut.create(bootstrap);

    sut.dispose();

    expect(unsubscribeSpy.calls.count()).toEqual(1);
    expect(gridMock.grid.onClick.unsubscribe.calls.count()).toEqual(1);
    expect(gridMock.grid.onClick.unsubscribe)
      .toHaveBeenCalledWith(clickCb);
    expect(gridMock.grid.onCellChange.unsubscribe.calls.count()).toEqual(1);
    expect(gridMock.grid.onCellChange.unsubscribe).toHaveBeenCalledWith(changeCb);
    done();
  });
});
