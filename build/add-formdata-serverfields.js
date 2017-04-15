module.exports = function (req, res, next) {

  var watching = req.path.indexOf('form-data', 0) !== -1;

  if (req.method === 'POST' && watching) {
    req.body.saved = new Date();
  }

  next();
}
