/**
 * @summary returns the metadata property on the form
 */
module.exports = function(router) {
  router.render = function(req, res) {
    var watching = req.originalUrl.indexOf('/metadata') !== -1;

    if (req.method === 'GET'  && watching) {
      var parts = req.url.split('/');

      const form = router.db.get('forms').getById(parts[2]).value();
      res.locals.data = form.metadata;
      res.jsonp(res.locals.data || []);
    } else {
      res.jsonp(res.locals.data);
    }
  }
}
