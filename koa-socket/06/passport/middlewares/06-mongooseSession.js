const session = require('koa-generic-session');
const mongooseStore = require('koa-session-mongoose');
const convert = require('koa-convert');

exports.init = app => app.use(convert(session({
  key:     'sid',
  cookie:  {
    httpOnly:  true,
    path:      '/',
    overwrite: true,
    signed:    false, // by default true (not needed here)
    maxAge:    3600 * 4 * 1e3 // session expires in 4 hours, remember me lives longer
  },

  // touch session.updatedAt in DB & reset cookie on every visit to prolong the session
  // koa-session-mongoose resaves the session as a whole, not just a single field
  rolling: true,

  store: mongooseStore.create({
    model:   'Session',
    expires: 3600 * 4
  })
})));
