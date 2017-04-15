module.exports = function(router) {
  return function (req, res, next) {

    var watching = req.path.indexOf('/snapshots', 0) !== -1;

    if (req.method === 'POST' && watching) {
      req.body = router.db.get('form-data').getById(req.body.originalId).value();
    }

    next();
  }
}
