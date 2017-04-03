const _elements = []; // cache of all elements passing by

/**
 * Builds the form template which is a combination of all element fragments
 * TODO on server
 */
module.exports = function (req, res, next) {

  var isForm = req.path.match(/\/api\/forms\/.+/, 0);
  var isElement = req.path.lastIndexOf('/api/elements', 0) === 0;

  if (req.method === 'POST' && isElement) {
    _elements.push(req.body);
  }

  if (req.method === 'PATCH' && isElement) {
    if (req.body.template) {
      for (var i = 0; i < _elements.length; i++) {
        // keep == not ===
        if (req.body.id == _elements[i].id) {
          _elements[i].template = req.body.template
          break;
        }
      }
    }
  }

  next();

  if (req.method === 'GET' && isForm) {
    if (res.locals && res.locals.data) res.locals.data.template = '';

    for (var i = 0; i < _elements.length; i++) {
      if (_elements[i].formId == req.params['id']) {
        res.locals.data.template += _elements[i].template;
      }
    }
  }
}
