var jsonServer = require('json-server');
var autoid = require('./autoid-generator');
var nocontent = require('./nocontent-middleware');
var delProps = require('./delete-props');
var formApi = require('./add-form-api');
var formDataParent = require('./add-formdata-parent');
var snapshot = require('./snapshot-formdata');
var routes = require('./routes');
var server = jsonServer.create();
var router = jsonServer.router('./src/db.json');
var middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);
server.use(nocontent);

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
server.use(autoid);
server.use(delProps);
server.use(formApi);
server.use(formDataParent(router));
server.use(snapshot(router));

server.use(jsonServer.rewriter(routes));

// Use default router
server.use(router);

server.listen(9001, function () {
  console.log('JSON Server is running');
});
