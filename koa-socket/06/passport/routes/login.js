
const passport = require('koa-passport');


exports.post = async function(ctx, next) {
  // запускает стратегию, станадартные опции что делать с результатом
  // опции @https://github.com/jaredhanson/passport/blob/master/lib/middleware/authenticate.js
  // можно передать и функцию
  await passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
    //failureMessage: true // запишет сообщение об ошибке в session.messages[]
    failureFlash: true // req.flash, better

    // assignProperty: 'something' присвоить юзера в свойство req.something
    //   - нужно для привязывания акков соц. сетей
    // если не стоит, то залогинит его вызовом req.login(user),
    //   - это поместит user.id в session.passport.user (если не стоит опция session:false)
    //   - также присвоит его в req.user
  })(ctx, next);

};

/*
exports.post = async function(ctx, next) {

  // @see node_modules/koa-passport/lib/framework/koa.js for passport.authenticate
  // it returns the middleware to delegate
  await passport.authenticate('local', async function(err, user, info) {
    // ...
    // ctx.body = {location: '/asdasd'};
  })(ctx, next);

};
*/
