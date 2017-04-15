import { GridFactory } from '../../../../src/resources/elements/grid-factory';
import { Grid } from 'slickgrid-es6';

describe('the grid custom element factory', () => {
  let sut;
  let gridId;
  let $grid;

  beforeEach(() => {
    gridId = '#my-slickgrid';
    sut = new GridFactory();

    $grid = document.createElement('div')
    $grid.id = 'my-slickgrid';
    document.body.appendChild($grid);
  });

  afterEach(() => {
    document.body.removeChild($grid);
  })

  it('creates a slickgrid instance', () => {
    const grid = sut.create({ gridId });

    expect(grid).toEqual(jasmine.any(Grid));
  });

  it('throws when no grid id is given', () => {
    const ex = () => sut.create();

    expect(ex).toThrow(new Error('No grid id was found'));
  })

  it('adds the grid container', () => {
    const grid = sut.create({ gridId });

    expect(grid.getContainerNode()).toBe($grid);
  });

  it('creates basic columns from the data with no column options', () => {
    const record = { id: 'a' };

    const grid = sut.create({
      gridId,
      data: [ record ]
    });

    expect(grid.getColumns()).toEqual([{
      name: 'Id',
      resizable: true,
      sortable: false,
      minWidth: 30,
      rerenderOnResize: false,
      headerCssClass: null,
      defaultSortAsc: true,
      focusable: true,
      selectable: true,
      width: 80,
      id: 'id',
      field: 'id'
    }]);
  });

  it('adds column options', () => {
    const record = { id: 'a', another: 'b' };
    const columnOptions = [{
      field: 'id', sortable: true, headerCssClass: 'someclass'
    }, {
      field: 'another', anything: true
    }];

    const grid = sut.create({
      gridId,
      data: [ record ],
      columnOptions
    });

    expect(grid.getColumns()[0].sortable).toBeTruthy();
    expect(grid.getColumns()[0].headerCssClass).toEqual('someclass');
    expect(grid.getColumns()[1].anything).toBeTruthy();
  });

  it('adds grid options', () => {
    const gridOptions = { blah: true };

    const grid = sut.create({
      gridId,
      gridOptions
    });

    // dont worry about the other default options
    expect(grid.getOptions().blah).toBeTruthy();
  });
})
