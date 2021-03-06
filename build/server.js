var jsonServer = require('json-server');
var middlewares = jsonServer.defaults();
var server = jsonServer.create();
var router = jsonServer.router('./src/db.json');

var addApiFormFields = require('./add-api-formfields');
var addApiFormDataFields = require('./add-api-formDatafields');
var addIdentity = require('./add-identity');
var convert404ToNoContent = require('./convert-404-to-nocontent');
var deleteNonApiFields = require('./delete-non-api-fields');
var copyFormData = require('./copy-parent-formdata');
var copyForm = require('./copy-form');
var patchMultipartFormData= require('./patch-multipart-formdata');
var getLookups = require('./get-lookups');
var getCurrentMember = require('./get-current-member');
var getFormProfile = require('./get-form-profile');
var routerRender = require('./composite-router-render');
var snapshot = require('./snapshot-formdata');
var routes = require('./routes');
var changeFormNameOnPast = require('./post-new-dashed-form-name');

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);
routerRender(router, [
  getFormProfile,
  getCurrentMember,
]);
server.use(getLookups);
server.use(convert404ToNoContent);

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
server.use(addIdentity);
server.use(deleteNonApiFields);
server.use(addApiFormFields);
server.use(patchMultipartFormData);
server.use(copyFormData(router));
server.use(copyForm(router));
server.use(snapshot(router));
server.use(addApiFormDataFields(router));
server.use(changeFormNameOnPast);

server.use(jsonServer.rewriter(routes));

// Use default router
server.use(router);

server.listen(9001, function () {
  console.log('JSON Server is running');
});
