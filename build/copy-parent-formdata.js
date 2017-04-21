var faker = require('faker');
var RandExp = require('randexp');

module.exports = function(router) {
  return function (req, res, next) {

    var watching = req.path.indexOf('forms/data/copy', 0) !== -1;
    var originalId = req.body.originalId;

    if (req.method === 'POST' && watching && originalId) {
      var parent = router.db.get('formData').getById(originalId).value();

      for (var prop in parent) req.body[prop] = parent[prop];

      req.body.id = null;
      req.body.originalId = null;

      var form = router.db.get('forms').getById(req.body.formId).value();

      if (form.autoname) {
        req.body.name = new RandExp(form.autoname).gen();
      } else {
        req.body.name = req.body.name + '_COPY_' + faker.random.uuid();
      }
    }

    next();
  }
}
