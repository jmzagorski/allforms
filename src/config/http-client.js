import * as HttpLogger from 'aurelia-http-logger';

// TODO need to make library API for accessable so testing is easier
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

/**
 * @summary Global configuration for the http client
 */
export default function configure(httpClient, baseUrl) {
  httpClient.configure(c => {
    c.useStandardConfiguration()
      .withDefaults({
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      .withBaseUrl(baseUrl)
      .withInterceptor(HttpLogger);
  });
}
