module.exports = function (req, res, next) {

  var watching = req.path.lastIndexOf('/api/elements', 0) === 0;

  if (req.method === 'POST' && watching) {
    req.body.id = Math.floor((Math.random() * 1000) + 1);
  }

  next();
}
