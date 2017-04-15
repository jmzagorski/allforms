import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper-webpack';
import { GridFactory } from '../../../../src/resources/elements/grid-factory';

describe('the grid custom element', () => {
  let sut;
  let factorySpy;
  let gridMock;

  beforeEach(() => {
    factorySpy = jasmine.createSpy('factory');
    gridMock = {
      getContainerNode: () => document.createElement('div'),
      resizeCanvas: () => {},
      destroy: () => {},
      getCanvasNode: () => document.createElement('div')
    };
    const factoryMock = { create: factorySpy };

    sut = StageComponent.withResources('resources/elements/grid');

    sut.configure = aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(GridFactory, factoryMock);
    };

    factorySpy.and.returnValue(gridMock);
  });

  afterEach(() => {
    if(sut.host.parentNode) sut.dispose();
  });

  it('creates the grid when attached', async done => {
    const options = {};
    const context = { id: 1, data: [], options, pk: '2' };

    sut.inView(`<grid id.bind="id" data.bind="data" options.bind="options" 
      pk.bind="pk"></grid>`)
      .boundTo(context);

    await sut.create(bootstrap);

    expect(factorySpy).toHaveBeenCalledWith({
      gridId: '#data-grid',
      pk: '2',
      data: context.data,
      columnOptions: [ ],
      gridOptions: options
    })
    expect(factorySpy.calls.argsFor(0)[0].gridOptions).toBe(options);
    done();
  });

  it('resizes the div to fit within the parent', async done => {
    let resize = false;
    const $child = document.createElement('span');

    gridMock.getContainerNode = () => $child;
    gridMock.resizeCanvas = () => resize = true;

    sut.inView(`<grid></grid>`)

    await sut.create(bootstrap);

    const expectWidth = sut.element.parentNode.offsetWidth - 1;

    expect($child.style.width).toEqual(expectWidth + 'px');
    expect(resize).toBeTruthy();
    done();
  });

  it('resizes the canvas to fit within the div', async done => {
    const $canvas = document.createElement('span');

    gridMock.resizeCanvas = jasmine.createSpy('resize');
    gridMock.getCanvasNode = () => $canvas;

    // make sure the width is not set before the resizing
    gridMock.resizeCanvas.and.callFake(() => {
      expect($canvas.style.width).toEqual('');
    });

    sut.inView(`<grid></grid>`)

    await sut.create(bootstrap);

    const expectWidth = sut.element.parentNode.offsetWidth - 3;

    expect($canvas.style.width).toEqual(expectWidth + 'px');
    expect(gridMock.resizeCanvas.calls.count()).toEqual(1);
    done();
  });

  it('has a div with the grid id', async done => {
    sut.inView(`<grid></grid>`);

    await sut.create(bootstrap);

    const div = sut.element.querySelector('#data-grid');

    expect(div).not.toEqual(null)
    done();
  });

  it('add columns', async done => {
    const column = { field: 'anything' }
    sut.inView(`<grid pk.bind="pk"></grid>`).boundTo({ pk: 'anything' });

    await sut.create(bootstrap);

    sut.viewModel.addColumn(column)


    expect(factorySpy.calls.argsFor(0)[0].columnOptions).toEqual([ column ]);
    expect(column.pk).toBeTruthy();
    done();
  });

  it('destroys the grid on detached', async done => {
    gridMock.destroy = jasmine.createSpy('destroy');
    sut.inView(`<grid></grid>`);

    await sut.create(bootstrap);

    sut.dispose();

    expect(gridMock.destroy.calls.count()).toEqual(1);
    done();
  });
});
