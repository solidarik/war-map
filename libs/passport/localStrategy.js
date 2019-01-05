let passport = require('koa-passport');
let LocalStrategy = require('passport-local');
let User = require('../../models/usersModel');

// Стратегия берёт поля из req.body
// Вызывает для них функцию
passport.use('local', new LocalStrategy({
    usernameField: 'email', // 'username' by default
    passwordField: 'password',
    passReqToCallback: true, // req for more complex cases
  },

  // Три возможных итога функции
  // done(null, user[, info]) ->
  //   strategy.success(user, info)
  // done(null, false[, info]) ->
  //   strategy.fail(info)
  // done(err) ->
  //   strategy.error(err)
  function(req, email, password, done) {

    const isEmail = /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(email);
    const findObj = isEmail ? { email: email } : { login: email };

    User.findOne(findObj, function(err, user) {

      if (err) {
        return done(err);
      }

      if (!user || !user.checkPassword(password)) {
        return done(null, false, 'Нет такого пользователя или пароль неверен.');
      }

      return done(null, user);
    });
  }));
