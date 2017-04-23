module.exports = function(req, res, router) {
  var isCurrent = req.originalUrl.indexOf('members/current') !== -1
  var isGet = req.method === 'GET';

  if (isGet && isCurrent && res.locals.data.length) {
    res.locals.data = res.locals.data[0];
  }
}
