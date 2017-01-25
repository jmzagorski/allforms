import '../../setup';
import {StageComponent} from 'aurelia-testing';
import {TabGroupCustomElement} from '../../../../src/resources/elements/tab-group';
import {bootstrap} from 'aurelia-bootstrapper-webpack';
import using from 'jasmine-data-provider';

describe('the tab content custom element', () => {
  let sut;
  let tabGroupSpy;

  beforeEach(() => {
    tabGroupSpy = jasmine.setupSpy('tabgroup', TabGroupCustomElement.prototype);

    sut = StageComponent
      .withResources('resources/elements/tab-content');

    sut.configure = aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(TabGroupCustomElement, tabGroupSpy);
    };
  });

  afterEach(() => {
    sut.dispose();
  });

  it('binds the header', async done => {
    let actualHeader = null;
    let expectHeader = 'test';
    sut.inView(`<tab-content header.bind="expectHeader"></tab-content>`)
      .boundTo({expectHeader});

    tabGroupSpy.addTab.and.callFake(tab => {
      actualHeader = tab.header;
    });

    await sut.create(bootstrap);

    expect(actualHeader).toEqual(expectHeader);
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
});
