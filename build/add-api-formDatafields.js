var RandExp = require('randexp');

module.exports = function(router) {

  return function (req, res, next) {
    var watching = req.path.indexOf('forms/data', 0) !== -1;

    if (req.method === 'POST' && watching) {

      var form = router.db.get('forms').getById(req.body.formId).value();

      if (form.autoname) {
        req.body.name = new RandExp(form.autoname).gen();
      }

      req.body.saved = new Date();
    }

    next();
  }
}
