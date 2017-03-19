import {Router} from 'aurelia-router';

/**
 * @desc Global configuration for the Router
 *
 */
export default class {

  static inject() { return [ Router ]; }

  constructor(router) {
    this.router = router;
  }

  configure() {
    return this.router.configure(c => {
      c.title = 'AllForms';

      c.map([{
        route: ['', '/:form/allforms'],
        name: 'allforms',
        moduleId: './forms',
        nav: false
      }, {
        route: '/:form',
        name: 'dir',
        moduleId: './directory',
        nav: false
      }, {
        route: '/:form/view',
        name: 'view',
        moduleId: './view',
        nav: false
      }, {
        route: '/:form/design',
        name: 'design',
        moduleId: './design',
        nav: false
      }, {
        route: '/:form/snapshots',
        name: 'snapshots',
        moduleId: './snapshots',
        nav: false
      }, {
        route: '/:form/lookups',
        name: 'lookups',
        moduleId: './lookups',
        nav: false
      }, {
        route: '/:form/contributors',
        name: 'contributors',
        moduleId: './contributors',
        nav: false
      }, {
        route: '/:form/history',
        name: 'history',
        moduleId: './history',
        nav: false
      }, {
        route: '/:form/settings',
        name: 'settings',
        moduleId: './settings',
        nav: false
      }]);
    });
  }
}
