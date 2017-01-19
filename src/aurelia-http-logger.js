// TODO - this will come from my github packagj
// just testing out the static version 2
// current version is 1
import { getLogger } from 'aurelia-logging';

const configs = [];
let logger = null;

function _parseDictionary(dictionary) {
  const messages = [];

  for (let v in dictionary) {
    if (dictionary.hasOwnProperty(v)) {
      messages.push(`(${v}) ${dictionary[v]}`);
    }
  }

  return messages;
}

/**
 * @desc gets the configuration object for the status code
 * @returns @type{IConfiguration} if exists
 */
function _getConfig(statusCode) {
  return configs.filter(c => c.statusCodes.indexOf(statusCode) !== -1)[0];
}

export function getConfigs() {
  return configs;
}

export function intercept(config) {
  if (!config) return;
  if (!logger) logger = getLogger('http-logging');

  for (let i = 0; i < configs.length; i++) {
    let codes = config.statusCodes.filter(s => _getConfig(s));

    if (codes.length > 0) {
      throw new Error(`Status codes: ${codes.join()} are already configured`);
    }
  }

  configs.push(config);
}

/**
 * @desc removes all configurations
 * @returns void
 */
export function release(config) {
  let index = configs.indexOf(config);
  if (index !== -1) {
    configs.splice(index, 1);
  }
}

/**
 * @desc Uses the configuration to log response errors to TheLogManager
 * @implements {Appender} responseError in aurelia-logging
 */
export function responseError(response) {
  const config = _getConfig(response.status);
  // i found that testing CORS with IIS did not have headers and just a message
  // so fall back to this if it is there
  const justMsg = response.message;
  const contentType = response.headers ? response.headers.get('content-type') : '';
  const inspectData = config && config.serverObjectName && contentType &&
    contentType.indexOf('application/json') !== -1;

  if (inspectData) {
    return response.json().then(data => {
      const errorObj = data[config.serverObjectName];

      if (!errorObj) {
        const errMsg = `No server object "${config.serverObjectName}" found`;
        logger.error(errMsg);
      } else {
        switch (errorObj.constructor) {
          case String:
            logger.error(config.message + ': ' + errorObj);
            break;
          case Array:
            logger.error(config.message + ': ' + errorObj.map(e => e).join(', '));
            break;
          case Object:
            const messages = _parseDictionary(errorObj);
            logger.error(config.message + ': ' + messages.map(e => e).join(', '));
            break;
          default:
            logger.error(`Unknown server object type ${errorObj.constructor}`);
        }
      }

      throw response;
    });
  } else if (config) {
    logger.error(config.message);
  } else if (justMsg) {
    logger.error(justMsg);
  }

  throw response;
}
