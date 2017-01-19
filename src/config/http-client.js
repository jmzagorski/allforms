import {HttpClient} from 'aurelia-fetch-client';
import {inject} from 'aurelia-framework';
// TODO - use my package once it is upgraded to use static
import * as HttpLogger from '../aurelia-http-logger';
import {getBaseUrl} from '../env';
import {PLATFORM} from 'aurelia-pal';

HttpLogger.intercept({
  statusCodes: [400],
  message: 'Bad Request',
  serverObjectName: 'validationErrors'
});
HttpLogger.intercept({
  statusCodes: [401],
  message: 'Authentication is required!'
});
HttpLogger.intercept({
  statusCodes: [403],
  message: 'Not Allowed! Please request access.'
});
HttpLogger.intercept({
  statusCodes: [500],
  message: 'You found a bug! Please contact support so we can fix it.'
});

@inject(HttpClient)
export default class {

  constructor(http) {
    this.client = http;
  }

  configure() {
    this.client.configure(c => {
      c.useStandardConfiguration()
        .withDefaults({
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        })
        .withBaseUrl(getBaseUrl(PLATFORM.location))
        .withInterceptor(HttpLogger);
    });
  }
}
