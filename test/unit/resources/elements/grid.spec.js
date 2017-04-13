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
      destroy: () => {}
    }
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

  it('creates the grid on binding', async done => {
    const context = { id: 1, data: [] };

    sut.inView(`<grid id.bind="id" data.bind="data"></grid>`)
      .boundTo(context);

    await sut.create(bootstrap);

    expect(factorySpy).toHaveBeenCalledWith({
      gridId: '#data-grid',
      data: context.data,
      columnOptions: [ { id: context.id, pk: true } ],
      gridOptions: { forceFitColumns: true }
    })
    done();
  });

  it('resizes the canvas to fit within th parent', async done => {
    let resize = false;
    const $child = document.createElement('span');

    gridMock.getContainerNode = () => $child;
    gridMock.resizeCanvas = () => resize = true;

    sut.inView(`<grid></grid>`)

    await sut.create(bootstrap);

    const expectWidth = sut.element.parentNode.offsetWidth - 2;

    expect($child.style.width).toEqual(expectWidth + 'px');
    expect(resize).toBeTruthy();
    done();
  });

  it('has a div with the grid id', async done => {
    sut.inView(`<grid></grid>`);

    await sut.create(bootstrap);

    const div = sut.element.querySelector('#data-grid');

    expect(div).not.toEqual(null)
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
