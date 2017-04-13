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

  it('adds the grid id', () => {
    const grid = sut.create({ gridId });

    expect(grid.getContainerNode()).toBe($grid);
  });

  it('creates columns from the data', () => {
    const record = { id: 'a' };

    const grid = sut.create({
      gridId,
      data: [ record, record ]
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

  it('sets the unique key', () => {
    const record = { anythingButId: 'a' };

    const grid = sut.create({
      gridId,
      data: [ record ],
      columnOptions: [ { id: 'anythingButId', pk: true } ]
    });

    expect(grid.getColumns().length).toEqual(1);
    expect(grid.getColumns()[0].id).toEqual('anythingButId');
    expect(grid.getColumns()[0].pk).toBeTruthy();
  });

  it('adds column options', () => {
    const gridOptions = { blah: true };
    const record = { id: 'a', another: 'b' };
    const columnOptions = [{
      id: 'id', sortable: true, headerCssClass: 'someclass'
    }, {
      id: 'another', anything: true
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

})
