import RouterConfig from './config/router';
import HttpConfig from './config/http-client';
import {inject} from 'aurelia-framework';
import {importFetch} from './utils';

const fetch = importFetch();

@inject(RouterConfig, HttpConfig)
export class App {

  constructor(routerConf, httpConf) {
    this.router = routerConf.router;
    this.username = null;
    this._routerConf = routerConf;
    this._httpConf = httpConf;
  }

  async activate() {
    this._routerConf.configure();
    this._httpConf.configure();

    const member = await this._httpConf.client.fetch('member')
      .then(response => response.json());

    this.username = member.loginName;
  }
}
