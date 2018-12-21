const passport = require('../libs/passport');

exports.init = app => app.use(passport.initialize());