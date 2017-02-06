import '../../setup';
import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper-webpack';
import using from 'jasmine-data-provider';

describe('the tab group custom element', () => {
  let sut;

  beforeEach(() => {
    sut = StageComponent
      .withResources('resources/elements/tab-group');

    sut.configure = aurelia => {
      aurelia.use.standardConfiguration();
    };
  });

  afterEach(() => {
    sut.dispose();
  });

  it('binds to the type of tab', async done => {
    let type = 'pill';

    sut.inView(`<tab-group type.bind="type"></tab-group>`)
      .boundTo({type})

    await sut.create(bootstrap);

    const ul = document.querySelector('ul');
    const li = document.querySelectorAll('li');
    expect(ul.className).toContain('nav nav-pills');
    // 0 because no tabs were added
    expect(li.length).toEqual(0);
    done();
  });

  it('defaults the tab type to tab', async done => {
    sut.inView(`<tab-group></tab-group>`);

    await sut.create(bootstrap);

    const ul = document.querySelector('ul');
    expect(ul.className).toContain('nav-tab');
    done();
  });

  it('has a div and slot for tab-content', async done => {
    sut.inView(`<tab-group></tab-group>`);

    await sut.create(bootstrap);

    const div = document.querySelector('div.tab-content');
    expect(div).not.toEqual(null);
    expect(div.innerHTML).toEqual('<!--slot-->');
    done();
  });

  // actual = actual tab, execpt: expected header
  using([
    { type: 'tab', actual: null, expect: ''},
    { type: 'random', actual: undefined, expect: ''},
    { type: 'pill', actual: { header: 'hi' }, expect: 'hi' }
  ], data => {
    it('adds tabs', async done => {
      sut.inView(`<tab-group type.bind="type"></tab-group>`)
        .boundTo({ type: data.type })

      await sut.create(bootstrap);
      sut.viewModel.addTab(data.actual);

      // let aurelia work its magic
      setTimeout(() => {
        const li = document.querySelectorAll('li');
        expect(li.length).toEqual(1);
        expect(li[0].className).toContain('active');
        const a = li[0].querySelector('a');
        expect(a).not.toEqual(null);
        expect(a.getAttribute('data-toggle')).toEqual(data.type);
        expect(a.innerHTML).toEqual(data.expect)
        done();
      });
    });
  });

  it('adds active to the first tab only', async done => {
    const tab1 = {};
    const tab2 = {};

    sut.inView(`<tab-group></tab-group>`);

    await sut.create(bootstrap);
    sut.viewModel.addTab(tab1);
    sut.viewModel.addTab(tab2);

    setTimeout(() => {
      const li = document.querySelectorAll('li');
      expect(li[1].className).not.toContain('active');
      expect(tab1.active).toBeTruthy();
      expect(tab2.active).toBeFalsy();
      done();
    })
  });

  it('activates the tab under the click', async done => {
    const tab1 = {};
    const tab2 = {};

    sut.inView(`<tab-group></tab-group>`);

    await sut.create(bootstrap);
    sut.viewModel.addTab(tab1);
    sut.viewModel.addTab(tab2);

    setTimeout(() => {
      const li = document.querySelectorAll('li');
      li[1].childNodes[0].click();

      setTimeout(() => {
        expect(li[0].className).not.toContain('active');
        expect(li[1].className).toContain('active');
        done();
      });
    });
  });

  it('removes the tab when called', async done => {
    const tab1 = {};

    sut.inView(`<tab-group></tab-group>`);

    await sut.create(bootstrap);
    sut.viewModel.addTab(tab1);

    setTimeout(() => {
      sut.viewModel.removeTab(tab1);

      setTimeout(() => {
        const li = document.querySelectorAll('li');
        expect(li.length).toEqual(0);
        done();
      });
    });
  });
});
