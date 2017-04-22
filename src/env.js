const localApi = '/api/';

export class EnvironmentService {

  constructor(platform) {
    // can be localhost or a custom URL too. guessing that a port is not used in
    // production
    this.isDebug = !!platform.location.port;
    this._platform = platform;
  }

  /**
   * @summary generates the application base api based on the environment 
   * @return {string} the api url
   */
  generateBaseApi() {
    if (this.isDebug) {
      return `http://${this._platform.location.hostname}:9001/api/`;
    }

    return localApi;
  }

  /**
   * @summary determines if the api param is local
   * @param {string} api the api to evaluate
   */
  isLocalApi(api) {
    return api === localApi || !api;
  }
}
