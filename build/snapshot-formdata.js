module.exports = function(router) {
  return function (req, res, next) {

    var watching = req.path.indexOf('/snapshots', 0) !== -1;

    if (req.method === 'POST' && watching) {
      req.body.data = router.db.get('form-data').getById(req.body.formDataId).value().data
      req.body.saved = new Date();
    }

    next();
  }
}
