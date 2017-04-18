module.exports = function(router) {
  return function (req, res, next) {

    var watching = req.path.indexOf('forms/data/snapshots', 0) !== -1;

    if (req.method === 'POST' && watching) {
      const original = router.db.get('formData').getById(req.body.originalId).value();

      for (var prop in original) {
        req.body[prop] = original[prop];
      }


      // add formDataumId so json-server can find it since it uses the singular
      // form of data
      req.body['formDatumId'] = req.body.originalId =  req.body.id;

      req.body.id = null;
    }

    next();
  }
}
