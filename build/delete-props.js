/**
 * @desc some of the properties are not going to be saved and have an adverse
 * affect on the code if they are saved
 */
module.exports = function (req, res, next) {
  var watching = req.path.lastIndexOf('/api/elements', 0) === 0;

  if (watching && (req.method === 'POST' || req.method === 'PUT')) {
    delete req.body.optionSrc;
  }

  next();
}

