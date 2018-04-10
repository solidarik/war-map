
// Usually served by Nginx
const serve = require('koa-static');

exports.init = app => app.use(serve('public'));
