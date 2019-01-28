const passport = require('koa-passport');

exports.get = async function(ctx, next) {
  ctx.body = ctx.render('login');
};

exports.post = passport.authenticate(
  'local',
  {
    failureFlash: true,
    failureRedirect: '/login',
    successReturnToOrRedirect: true,
  });