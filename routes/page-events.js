exports.get = async function(ctx, next) {
  if (ctx.isAuthenticated()) {
    ctx.body = ctx.render('page-events');
  } else {
    ctx.body = ctx.render('login');
 }

};
