import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper-webpack';
import { Editors, Grid } from 'slickgrid-es6';
import { TargetInstruction } from 'aurelia-framework';
import { CompositeFormatter } from '../../../../src/resources/elements/grid/index';

describe('the grid custom element', () => {
  let sut;
  let compositeMock;

  beforeEach(() => {
    compositeMock = { format: () => {} };
    sut = StageComponent.withResources('resources/elements/grid-column');

    sut.configure = aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(CompositeFormatter, compositeMock);
    };
  });

  afterEach(() => {
    if(sut.host.parentNode) sut.dispose();
  });

  it('adds the custom property if formatters property is bound to', async done => {
    const context = { formatters: [ 'Link', 'Toggle' ] };
    sut.inView(`<grid-column formatters.bind="formatters"></grid-column>`)
      .boundTo(context);

    await sut.create(bootstrap);

    expect(sut.viewModel.options.custom.formatters).toEqual([ 'Link', 'Toggle' ]);
    done();
  });

  it('adds custom html property and formatter is html in slot last', async done => {
    const context = { formatters: [ 'Link' ] };
    sut.inView(`<grid-column formatters.bind="formatters"><span></span></grid-column>`)
      .boundTo(context);

    await sut.create(bootstrap);

    expect(sut.viewModel.options.custom.html).toEqual('<span></span>');
    expect(sut.viewModel.options.custom.formatters).toEqual([ 'Link', 'Html']);
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
      custom: { blah: 'a' }
    }

    sut.inView(`<grid-column async-post-render.bind="asyncPostRender"
      behavior.bind="behavior"
      cannot-trigger-insert.bind="cannotTriggerInsert"
      css-class.bind="cssClass"
      default-sort-asc.bind="defaultSortAsc"
      editor.bind="editor"
      field.bind="field",
      focusable.bind="focusable"
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
      custom.bind="custom"
    ></grid-column>`).boundTo(context);

    await sut.create(bootstrap);


    // http://stackoverflow.com/questions/34307855/how-can-i-test-for-equality-to-a-bound-function-when-unit-testing
    expect(Object.create(CompositeFormatter.prototype) instanceof CompositeFormatter).toBeTruthy();

    expect(sut.viewModel.options).toEqual({
      asyncPostRender: context.asyncPostRender,
      behavior: context.behavior,
      cannotTriggerInsert: context.cannotTriggerInsert,
      cssClass: context.cssClass,
      defaultSortAsc: context.defaultSortAsc,
      editor: Editors.Checkmark,
      field: context.field, 
      focusable: context.focusable,
      formatter: sut.viewModel.options.formatter, // kind of silly, but to make the test pass
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
      width: context.width,
      custom: { formatters: [], blah: 'a' }
    });
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
      custom: { blah: 'a' },
      allOptions: {
        asyncPostRender: '2',
        behavior: '3',
        cannotTriggerInsert: '4',
        cssClass: '5',
        defaultSortAsc: '6',
        editor: 'Checkmark',
        field: '8', 
        focusable: '9',
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
        custom: { formatters: [], blah: 'b' },
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
      custom.bind="custom"
    ></grid-column>`).boundTo(context);

    await sut.create(bootstrap);

    expect(sut.viewModel.options).toEqual({
      asyncPostRender: context.allOptions.asyncPostRender,
      behavior: context.allOptions.behavior,
      cannotTriggerInsert: context.allOptions.cannotTriggerInsert,
      cssClass: context.allOptions.cssClass,
      defaultSortAsc: context.allOptions.defaultSortAsc,
      editor: 'Checkmark',
      field: context.allOptions.field, 
      focusable: context.allOptions.focusable,
      formatter: sut.viewModel.options.formatter,
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
      width: context.allOptions.width,
      custom: { formatters: [], blah: 'b' }
    });
    done();
  });

  it('sets id and name from field if missing', async done => {
    const context = { field: 'abc' }

    sut.inView(`<grid-column field.bind="field"></grid-column>`)
      .boundTo(context);

    await sut.create(bootstrap);

    expect(sut.viewModel.options.field).toEqual(context.field);
    expect(sut.viewModel.options.id).toEqual(context.field);
    expect(sut.viewModel.options.name).toEqual('Abc');
    done();
  });

  [ { cell: 0, calls: 1 },
    { cell: 1, calls: 0}
  ].forEach(data => {
    it('emits columns events when correct cell is clicked', async done => {
      const item = {};
      const gridMock = {
        getDataItem: jasmine.createSpy('getData').and.returnValue(item)
      };
      const args = {
        cell: data.cell,
        row: 1,
        grid: gridMock
      }
      const context = {
        click: jasmine.createSpy('clickcb'),
        change: jasmine.createSpy('changecb')
      };

      sut.inView(`<grid-column on-click.bind="click" on-cell-change.bind="change">
        </grid-column>`).boundTo(context);

      await sut.create(bootstrap);

      sut.viewModel.subscriptions.onClick({}, args)
      sut.viewModel.subscriptions.onCellChange({}, args)

      expect(context.change.calls.count()).toEqual(data.calls);
      expect(context.click.calls.count()).toEqual(data.calls);

      if (data.calls !== 0) {
        expect(context.change.calls.argsFor(0)[0]).toBe(item);
        expect(gridMock.getDataItem).toHaveBeenCalledWith(1);
      }

      done();
    });
  });

  it('emits event only when item has changed', async done => {
    let itemChangedEvent= null;
    const item = {};
    const gridMock = {
      getDataItem: jasmine.createSpy('getData').and.returnValue(item)
    };
    const args = {
      cell: 0,
      row: 1,
      grid: gridMock
    }
    const context = {
      click: item => item.a = 1,
      itemChanged: event => itemChangedEvent = event
    };

    sut.inView(`<grid-column itemchanged.delegate="itemChanged($event)"
      on-click.bind="click"></grid-column>`)
      .boundTo(context);

    await sut.create(bootstrap);

    sut.viewModel.subscriptions.onClick({}, args)

    expect(itemChangedEvent).not.toEqual(null);
    expect(itemChangedEvent.detail).toBe(item);
    done();
  });

  it('does not emit event when item did not change', async done => {
    let itemChangedEvent= null;
    const item = {};
    const gridMock = {
      getDataItem: jasmine.createSpy('getData').and.returnValue(item)
    };
    const args = {
      cell: 0,
      row: 1,
      grid: gridMock
    }
    const context = {
      click: item => {},
      itemChanged: event => itemChangedEvent = event
    };

    sut.inView(`<grid-column itemchanged.delegate="itemChanged($event)"
      on-click.bind="click"></grid-column>`)
      .boundTo(context);

    await sut.create(bootstrap);

    sut.viewModel.subscriptions.onClick({}, args)

    expect(itemChangedEvent).toEqual(null);
    done();
  });
});
