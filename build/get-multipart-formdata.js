var multiparty = require('multiparty');

module.exports = function (req, res, next) {

  var watching = req.path.indexOf('forms/data', 0) !== -1;

  if (req.method === 'PATCH' && watching ) {
    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
      req.body.data = {};

      for (var f in fields) {
        req.body.data[f] = fields[f];
      }

      for (var f in files) {
        req.body.data[f] = files[f];

        for (var i = 0; i < files[f].length; i++) {
          req.body.data[f][i].url = files[f][i].path;
          req.body.data[f][i].name = files[f][i].originalFilename;
        }
      }

      // add the app interface

      next();
    });
  } else {
    next();
  }

}
