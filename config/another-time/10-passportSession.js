//soli
return;

const sessionFunc = require('koa-passport').session();
exports.init = app => app.use(sessionFunc);
