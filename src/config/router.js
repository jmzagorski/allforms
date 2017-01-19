import {Router} from 'aurelia-router';
import {inject} from 'aurelia-framework';

@inject(Router)
export default class {

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
        route: '/:form/lookups',
        name: 'lookups',
        moduleId: './lookups',
        nav: false
      }, {
        route: '/:form/users',
        name: 'users',
        moduleId: './users',
        nav: false
      }, {
        route: '/:form/history',
        name: 'history',
        moduleId: './history',
        nav: false
      }]);
    });
  }
}
