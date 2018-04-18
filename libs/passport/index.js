const passport = require('koa-passport');

require('./serialize');

passport.use(require('./localStrategy'));

module.exports = passport;
