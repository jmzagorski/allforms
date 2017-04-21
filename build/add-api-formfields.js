/**
 * @desc replaces or inserts the form api into the form html action method
 * just quick and dirty regext logic to mimick what the server should do
 */
module.exports = function (req, res, next) {

  var watching = req.path.lastIndexOf('/api/forms', 0) === 0;

  if ((req.method === 'POST' || req.method === 'PUT') && watching) {
    if (req.body.api && req.body.template) {
      req.body.template = req.body.template
        .replace(/action=".*?"/, 'action="' + req.body.api + '"')
    }
  }

  next();
}
