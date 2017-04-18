/**
 * @desc if json-server cannot find any data at the resource it returns a 404.
 * The templates resource exists, but no-content should be returned as an empty
 * json body. I needed to do this because all forms will not have a template
 * initially because i am using json-schema faker to fake the forms
 */
module.exports = function (req, res, next) {
  // not sure why baseUrl is empty
  var isWatching = watching(req.path, '/api/templates') ||
    watching('/api/form-settings');

  var nocontent = !res.locals.data;

  if (isWatching && nocontent) {
    // if you dont set the data property then json-server will not throw a 404
    res.locals.data = {};
  }

  if (req.path.match(/\/api\/forms\/[a-z]+\/data/i) && nocontent) {
    console.log('data unset')
    res.locals.data = [];
  }

  next();
}

function watching(path, api) {
  return path.lastIndexOf(api, 0) === 0;
}
