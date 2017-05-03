const localApi = '/api/';

export class EnvironmentService {

  constructor(platform) {
    // can be localhost or a custom URL too. guessing that a port is not used in
    // production
    this.isDebug = !!platform.location.port;
    this._platform = platform;

    this._debugUrl = `http://${this._platform.location.hostname}:9001/api/`;
  }

  /**
   * @summary generates the application base api based on the environment 
   * @return {string} the api url
   */
  generateBaseApi() {
    if (this.isDebug) {
      return this._debugUrl;
    }

    return localApi;
  }

  /**
   * @summary determines if the api param is local.
   * @param {string} api the api to evaluate
   */
  isLocalApi(api) {
    // no api so i allow no api setup for local calls
    return api === localApi || !api || api.substr(0, this._debugUrl.length) === this._debugUrl;
  }
}
