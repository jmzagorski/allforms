// for some reason my custom routes are not working as i want
// and the one i have setup returns an array and it should be an object
module.exports = function (req, res, next) {

  var watching = req.path.indexOf('/lookups') !== -1;

  if (req.method === 'GET' && watching) {
    req.url = '/lookups/' + req.query.id
  }

  next();

}
