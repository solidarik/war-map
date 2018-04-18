// initialize template system early, to let error handler use them
// koa-views is a wrapper around many template systems!
// most of time it's better to use the chosen template system directly
const pug = require('pug');
const config = require('config');
const path = require('path');

const render = async function(ctx, next) {

  const context = {};

  /* default helpers */
  context.locals = {
    /* at the time of ctx middleware, user is unknown, so we make it a getter */
    get user() {
      return ctx.req.user; // passport sets ctx
    },

    get flash() {
      return ctx.flash();
    }
  };

  context.locals.csrf = function() {
    // async function, not a property to prevent autogeneration
    // pug touches all local properties
    return ctx.csrf;
  };

  ctx.render = function(templatePath, locals) {
    locals = locals || {};
    // warning!
    // _.assign does NOT copy defineProperty
    // so I use ctx.locals as a root and merge all props in it, instead of cloning ctx.locals
    const localsFull = Object.create(context.locals);

    for(const key in locals) {
      localsFull[key] = locals[key];
    }

    const templatePathResolved = path.join(config.template.root, templatePath + '.pug');

    return pug.renderFile(templatePathResolved, localsFull);
  };

  await next();

};

exports.init = app => app.use(render);
