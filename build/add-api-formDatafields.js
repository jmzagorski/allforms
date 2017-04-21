module.exports = function(router) {

  return function (req, res, next) {
    var watching = req.path.indexOf('forms/data', 0) !== -1;

    if (req.method === 'POST' && watching) {
      req.body.saved = new Date();
    }

    next();
  }
}
