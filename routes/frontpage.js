exports.get = async function(ctx, next) {
  //soli if (ctx.isAuthenticated()) {
  //  ctx.body = ctx.render('chat');
  //} else {
    ctx.body = ctx.render('main');
 // }

};
