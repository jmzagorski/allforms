/**
 * returns the metadata property on the form
 * if the limit is set to one, turn it into an object (for get active member);
 */
module.exports = function(router, others) {
  router.render = function(req, res) {
    for (var i = 0, len = others.length; i < len; i++) {
      others[i](req, res, router)
    }

    res.jsonp(res.locals.data);
  }
}
