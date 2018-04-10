// initialize template system early, to let error handler use them
// koa-views is a wrapper around many template systems!
// most of time it's better to use the chosen template system directly
const pug = require('pug');
const config = require('config');
const path = require('path');

exports.init = app => app.use(async (ctx, next) => {

  /* default helpers */
  ctx.locals = {
    /* at the time of ctx middleware, user is unknown, so we make it a getter */
    get user() {
      return ctx.req.user; // passport sets ctx
    },

    get flash() {
      return ctx.flash();
    }
  };

  ctx.locals.csrf = function() {
    // async function, not a property to prevent autogeneration
    // pug touches all local properties
    return ctx.csrf;
  };

  ctx.render = function(templatePath, locals) {
    locals = locals || {};
    // use inheritance for all getters to work
    const localsFull = Object.create(ctx.locals);

    for(const key in locals) {
      localsFull[key] = locals[key];
    }

    const templatePathResolved = path.join(config.template.root, templatePath + '.pug');

    return pug.renderFile(templatePathResolved, localsFull);
  };

  await next();

});
