/**
 * @desc if json-server cannot find any data at the resource it returns a 404.
 * The templates resource exists, but no-content should be returned as an empty
 * json body. I needed to do this because all forms will not have a template
 * initially because i am using json-schema faker to fake the forms
 */
module.exports = function (req, res, next) {
  // not sure why baseUrl is empty
  var isTemplate = req.path.lastIndexOf('/templates', 0) === 0;

  if (isTemplate && !res.locals.data) {
    // if you set the data property than json-server will not throw a 404
    res.locals.data = {};
  }

  next();
}
