var constants = require('./constants');

/**
 * @summary this is mainly for nested relationship since json-server does not
 * support that, but since i am using json-schema-faker i need to guarentee that
 * a user has forms. With faker I have no guarentee that a separate forms array
 * with have a member id
 */
module.exports = function (req, res, next) {
  var isWatching = watching('/api/form-settings');
  var watchingArray = req.path.match(/\/api\/forms\/[a-z]+\/data/i);
  var nocontent = !res.locals.data;

  if (isWatching && nocontent) {
    // if you dont set the data property then json-server will not throw a 404
    res.locals.data = {};
  }

  if (watchingArray && nocontent) res.locals.data = [];

  next();
}

function watching(path, api) {
  return path.lastIndexOf(api, 0) === 0;
}
