const User = require('../../models/user');
const passport = require('koa-passport');

// паспорт напрямую с базой не работает
passport.serializeUser(function(user, done) {
  console.log('serializeUser');
  done(null, user.email); // uses _id as idFieldd
});

passport.deserializeUser(function(id, done) {
  console.log('deserializeUser');
  User.findOne({email: email}, done); // callback version checks id validity automatically
});
