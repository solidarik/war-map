
// Usually served by Nginx
const serve = require('koa-static');
const convert = require('koa-convert');

exports.init = app => app.use(convert(serve('public')));
