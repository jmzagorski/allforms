/**
 * @desc replaces or inserts the form api into the form html action method
 * just quick and dirty regext logic to mimick what the server should do
 */
module.exports = function (req, res, next) {

  var watching = req.path.lastIndexOf('/api/forms', 0) === 0;
      req.path.lastIndexOf('/api/forms/data', 0) === 0;

  if (req.method === 'POST' && watching) {
    req.body.name = req.body.name.replace(/ /g, '-')
      .replace(/\./g, '-').replace('/\/g', '-').replace(/\\/g, '-');
  }

  next();
}
