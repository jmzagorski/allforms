var faker = require('faker');
var RandExp = require('randexp');

module.exports = function(router) {
  return function (req, res, next) {

    var watching = req.path.indexOf('/copy', 0) !== -1;
    var parentId = req.body.parentId;

    if (req.method === 'POST' && watching && parentId) {
      var parent = router.db.get('form-data').getById(req.body.parentId).value();
      req.body.parentId = parentId;

      for (var prop in parent) req.body[prop] = parent[prop];

      req.body.id = null;

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
