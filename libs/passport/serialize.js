const User = require('../../models/usersModel');
const passport = require('koa-passport');

// паспорт напрямую с базой не работает
passport.serializeUser(function(user, done) {
  console.log('serializeUser');
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  console.log('deserializeUser: ' + id);
  User.findById(id, (err, user) => {
    if (err)
      done(err, null);
    else
      done(null, user);
  });
});
