exports.get = async function(ctx, next) {
  if (ctx.isAuthenticated()) {
    ctx.body = ctx.render('chat');
  } else {
    ctx.body = ctx.render('login');
  }

};
