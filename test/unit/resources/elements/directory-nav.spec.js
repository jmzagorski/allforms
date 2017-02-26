import '../../setup';
import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper-webpack';
import {EventAggregator} from 'aurelia-event-aggregator';
import * as utils from '../../../../src/utils';
import {PLATFORM} from 'aurelia-pal';
import using from 'jasmine-data-provider';

describe('the directory nav custom element', () => {
  let sut;
  let buildFxSpy;
  let eaSpy;
  let subscriptionMock;

  beforeEach(() => {
    eaSpy = jasmine.setupSpy('ea', EventAggregator.prototype);
    buildFxSpy = spyOn(utils, 'buildLocationLinks');
    subscriptionMock = {
      dispose: () => {}
    };

    sut = StageComponent
      .withResources('resources/elements/directory-nav');

    sut.configure = aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(EventAggregator, eaSpy);
    };

    eaSpy.subscribe.and.returnValue(subscriptionMock);
  });

  afterEach(() => {
    sut.dispose();
  });

  it('subscribes to the router navigation success', done => {
    sut.inView(`<directory-nav></directory-nav>`);

    sut.create(bootstrap).then(() => {
      expect(eaSpy.subscribe.calls.count()).toEqual(1);
      expect(eaSpy.subscribe.calls.first().args[0]).toEqual('router:navigation:success');
      done();
    });
  });

  using([
    { root: 'root', href: 'root', hash: '' },
    { root: 'root', href: 'root#', hash: '#/whatever' },
    { root: null, href: '/', hash: '' },
    { root: null, href: '/#', hash: '#/other' }
  ], data => {
    it('handles the navigation success event', async done => {
      PLATFORM.location.hash = data.hash;
      let event = {
        instruction: {
          router: {
            options: {
              root: data.root
            }
          }
        }
      };

      buildFxSpy.and.returnValue([
        { url: '.net', display: 'first' },
        { url: '.com', display: 'second' }
      ])

      sut.inView(`<directory-nav root-name.bind="root"></directory-nav>`)
        .boundTo({root: "home"});

      eaSpy.subscribe.and.callFake((name, handler) => {
        handler(event);
        return subscriptionMock;
      });

      await sut.create(bootstrap);
      const ul = document.querySelector('ul');
      const link = document.querySelectorAll('ul li a');
      expect(ul.className).toEqual('breadcrumb');
      expect(link.length).toEqual(3);
      expect(link[0].getAttribute('href')).toEqual(data.href);
      expect(link[0].innerHTML).toEqual('home');
      expect(link[1].getAttribute('href')).toEqual('.net');
      expect(link[1].innerHTML).toEqual('first');
      expect(link[2].getAttribute('href')).toEqual('.com');
      expect(link[2].innerHTML).toEqual('second');
      done();
    });
  })
});
