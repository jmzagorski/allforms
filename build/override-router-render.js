/**
 * returns the metadata property on the form
 * if the limit is set to one, turn it into an object (for get active member);
 */
module.exports = function(router) {
  router.render = function(req, res) {
    var metadata = req.originalUrl.indexOf('/metadata') !== -1;
    var isGet = req.method === 'GET';

    if (isGet && metadata) {
      var parts = req.url.split('/');
      const form = router.db.get('forms').getById(parts[2]).value();
      res.locals.data = form.metadata;
      res.jsonp(res.locals.data || []);
    } else if (req.url.indexOf('?_limit=1') !== -1) {
      res.locals.data = res.locals.data[0];
    } else {
      res.jsonp(res.locals.data);
    }
  }
}
