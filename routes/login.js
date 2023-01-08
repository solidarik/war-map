import passport from 'koa-passport'

const get = async function (ctx, next) {
  ctx.body = ctx.render('login');
};

const post = passport.authenticate(
  'local',
  {
    failureFlash: true,
    failureRedirect: '/login',
    successReturnToOrRedirect: true,
  });

export { get, post }