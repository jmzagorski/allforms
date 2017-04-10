module.exports = function (req, res, next) {
  next();

  var watching = req.path.indexOf('/lookups') !== -1;

  if(watching) console.log(res);
  if(watching) console.log(req);
  if (req.method === 'GET' && watching && res.locals && res.locals.data) {
    console.log(res.locals.data);
    req.locals.data = req.locals.data.value;
  }

}
