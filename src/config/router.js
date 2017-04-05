import { Router } from 'aurelia-router';

/**
 * @summary Global configuration for the Router
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
        route: ['', '/allforms'],
        name: 'allforms',
        moduleId: './forms',
        nav: false
      }, {
        route: '/:form',
        name: 'dir',
        moduleId: './directory',
        nav: false
      }, {
        route: '/:form/data/:formDataId',
        name: 'formData',
        moduleId: './data-edit',
        nav: false
      }, {
        route: '/:form/data/new',
        name: 'newData',
        moduleId: './data-new',
        nav: false
      }, {
    /*
     * EVERYTHING BELOW HERE SHOULD HAVE A SETTINGS AND BE ORDERED IN THE 
     * ORDER YOU WANT THE USER TO SEE THE ICONS. THESE WILL APPEAR AS A LIST IN 
     * THE DIRECTORY ROUTE
     */
        route: '/:form/data',
        name: 'data',
        moduleId: './data',
        nav: false,
        settings: {
          dirListing: true,
          icon: 'folder',
          description: 'data forms based on your template'
        }
      }, {
        route: '/:form/view',
        name: 'view',
        moduleId: './view',
        nav: false,
        settings: {
          dirListing: true,
          icon: 'eye',
          description: 'design how your form will print'
        }
      }, {
        route: '/:form/design',
        name: 'design',
        moduleId: './design',
        nav: false,
        settings: {
          dirListing: true,
          icon: 'magic',
          description: 'design the look of your form'
        }
      }, {
        route: '/:form/contributors',
        name: 'contributors',
        moduleId: './contributors',
        nav: false,
        settings: {
          dirListing: true,
          icon: 'users',
          description: 'maintain user security'
        }
      }, {
        route: '/:form/history',
        name: 'history',
        moduleId: './history',
        nav: false,
        settings: {
          dirListing: true,
          icon: 'file-text-o',
          description: 'view changes to your form template'
        }
      }, {
        route: '/:form/interface',
        name: 'interface',
        moduleId: './interface',
        nav: false,
        settings: {
          dirListing: true,
          icon: 'handshake-o',
          description: 'create predefined fields'
        }
      }, {
        route: '/settings/:form?',
        name: 'settings',
        moduleId: './settings',
        nav: false,
        settings: {
          dirListing: true,
          icon: 'cog',
          description: 'your form preferences'
        }
      }]);
    });
  }
}
