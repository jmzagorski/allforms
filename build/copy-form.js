var faker = require('faker');
var RandExp = require('randexp');

module.exports = function(router) {
  return function (req, res, next) {

    var watching = req.path.indexOf('forms/copy', 0) !== -1;
    var originalId = req.body.originalId;
    var copyingToMember = req.body.memberId

    if (req.method === 'POST' && watching && originalId) {
      var parent = router.db.get('forms').getById(originalId).value();

      for (var prop in parent) req.body[prop] = parent[prop];

      req.body.id = null;
      req.body.memberId = copyingToMember;
    }

    next();
  }
}
