module.exports = function(router) {
  return function (req, res, next) {

    var watching = req.path.indexOf('form-data', 0) !== -1;

    if (req.method === 'POST' && watching && req.body.parentId) {
      req.body.data = router.db.get('form-data').getById(req.body.parentId).value().data
    }

    next();
  }
}
