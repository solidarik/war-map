const passport = require('koa-passport');

require('./serialize');
require('./localStrategy');

module.exports = passport;
