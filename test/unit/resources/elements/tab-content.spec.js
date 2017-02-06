import '../../setup';
import { StageComponent } from 'aurelia-testing';
import { TabGroupCustomElement } from '../../../../src/resources/elements/tab-group';
import { bootstrap } from 'aurelia-bootstrapper-webpack';
import using from 'jasmine-data-provider';

describe('the tab content custom element', () => {
  let sut;
  let tabGroupSpy;

  beforeEach(() => {
    tabGroupSpy = jasmine.setupSpy('tabgroup', TabGroupCustomElement.prototype);
    tabGroupSpy.tabs = [];

    sut = StageComponent
      .withResources('resources/elements/tab-content');

    sut.configure = aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(TabGroupCustomElement, tabGroupSpy);
    };
  });

  afterEach(() => sut.dispose());

  it('calls the tab group to add the tab on binding', async done => {
    let actualTab = null
    const expectHeader = 'test';
    const expectActive = false;

    sut.inView(`<tab-content header.bind="expectHeader"></tab-content>`)
      .boundTo({expectHeader});

    tabGroupSpy.addTab.and.callFake(tab => actualTab = tab);

    await sut.create(bootstrap);

    expect(actualTab.header).toEqual(expectHeader);
    expect(actualTab.active).toBeFalsy();
    done();
  });

  it('shows when tab is active', async done => {
    sut.inView(`<tab-content></tab-content>`)

    await sut.create(bootstrap);

    const pane = document.querySelector('div.tab-pane');
    expect(pane).not.toEqual(null);
    expect(pane.className).toContain('fade')
    expect(pane.className).not.toContain('in active')
    sut.viewModel.active = true;
    setTimeout(() => {
      expect(pane.className).toContain('in active');
      done();
    })
  });

  it('has a slot for the div content', async done => {
    sut.inView(`<tab-content></tab-content>`)

    await sut.create(bootstrap);

    const pane = document.querySelector('div.tab-pane');
    expect(pane.innerHTML).toContain('<!--slot-->');
    done();
  });

  it('removes the tab when detached', async done => {
    sut.inView(`<tab-content></tab-content>`)
    await sut.create(bootstrap);

    sut.viewModel.detached();

    expect(tabGroupSpy.removeTab).toHaveBeenCalledWith(sut.viewModel);
    done();
  });

  it('dispatches the activated event when active is set to true', async done => {
    let event = null;
    const activate = e => event = e;
    const expectHeader = 'test';
    sut.inView(`<tab-content header.bind="expectHeader"></tab-content>`)
      .boundTo({expectHeader});
    await sut.create(bootstrap);
    tabGroupSpy.tabs = [null, sut.viewModel];

    sut.element.parentNode.addEventListener('activate', activate, false);
  
    sut.viewModel.active = true;

    expect(event).not.toEqual(null);
    expect(event.detail).toBeDefined();
    expect(event.detail.header).toEqual(expectHeader);
    expect(event.detail.index).toEqual(1);
    done();
  });
});
