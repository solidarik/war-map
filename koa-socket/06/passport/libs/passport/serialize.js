const User = require('../../models/user');
const passport = require('koa-passport');

// паспорт напрямую с базой не работает
passport.serializeUser(function(user, done) {
  done(null, user.email); // uses _id as idField
});

passport.deserializeUser(function(email, done) {
  User.findOne({email:email}, done); // callback version checks id validity automatically
});
