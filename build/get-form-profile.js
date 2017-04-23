var constants = require('./constants');

module.exports = function(req, res, router) {
  var isProfile = req.originalUrl.match(constants.FORM_PROFILE_REGEX);
  var isGet = req.method === 'GET';

  if (isGet && isProfile && res.locals.data.length) {
    res.locals.data = res.locals.data[0];
  }
}
