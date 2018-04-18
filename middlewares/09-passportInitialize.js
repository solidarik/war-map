const passport = require('../libs/passport');

// - инициализовать ctx.req._passport (вспомогательный контекст, нам не понадобится)
// - сделать на ctx методы
//   ctx.login(user)
//   ctx.logout()
//   ctx.isAuthenticated()
// @see https://github.com/rkusa/koa-passport/blob/master/lib/framework/koa.js
// @see https://github.com/jaredhanson/passport/blob/master/lib/middleware/initialize.js
exports.init = app => app.use(passport.initialize());
