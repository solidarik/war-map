// A "closer to real-life" app example
// using 3rd party middleware modules
// P.S. MWs calls be refactored in many files

// long stack trace (+clarify from co) if needed
if (process.env.TRACE) {
  require('./libs/trace');
}

const Koa = require('koa');
const app = new Koa();

const config = require('config');
const mongoose = require('./libs/mongoose');

// keys for in-koa KeyGrip cookie signing (used in session, maybe other modules)
app.keys = [config.secret];
app.mongoose = mongoose;

const path = require('path');
const fs = require('fs');

const middlewares = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();
middlewares.forEach(handler => require('./middlewares/' + handler).init(app));

/*
middlewares.forEach(function(middleware) {
  app.use(require('./middlewares/' + middleware));
});*/

// ---------------------------------------

// can be split into files too
const Router = require('koa-router');

const router = new Router();

router.get('/', require('./routes/frontpage').get);
router.get('/cleardb', require('./routes/cleardb').get);

//router.post('/login', require('./routes/login').post);
//router.post('/logout', require('./routes/logout').post);
// router.get('/', require('./routes/login').post);

app.use(router.routes());

const serverSocket = require('./libs/serverSocket');
const server = app.listen(config.port);

let protocolFunctions = [];
const protocolClasses = fs.readdirSync(path.join(__dirname, 'socketProtocol')).sort();
protocolClasses.forEach(handler => {
  let protocolClass = require('./socketProtocol/' + handler);
  protocolClass.init();
  protocolFunctions.push(protocolClass.getProtocol(app) );
});

app.socket = serverSocket(server, protocolFunctions);
