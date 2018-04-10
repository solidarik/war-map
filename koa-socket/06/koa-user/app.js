const Koa = require('koa');
const app = module.exports = new Koa();

const config = require('config');
const mongoose = require('./libs/mongoose');

const path = require('path');
const fs = require('fs');

const handlers = fs.readdirSync(path.join(__dirname, 'handlers')).sort();

handlers.forEach(handler => require('./handlers/' + handler).init(app));

// ---------------------------------------

// can be split into files too
const Router = require('koa-router');
const pick = require('lodash/pick');

const router = new Router({
  prefix: '/users'
});

const User = require('./libs/user');

async function loadUserById(ctx, next) {
  if (!mongoose.Types.ObjectId.isValid(ctx.params.userById)) {
    ctx.throw(404);
  }

  ctx.userById = await User.findById(ctx.params.userById);

  if (!ctx.userById) {
    ctx.throw(404);
  }

  await next();
}

router
  // .param('userById', async (id, ctx, next) => {
  //   if (!mongoose.Types.ObjectId.isValid(id)) {
  //     ctx.throw(404);
  //   }
  //
  //   ctx.userById = await User.findById(id);
  //
  //   if (!ctx.userById) {
  //     ctx.throw(404);
  //   }
  //
  //   await next();
  // })
  .post('/', async function(ctx, next) {
    let user = await User.create(pick(ctx.request.body, User.publicFields));

    // userSchema.options.toObject.transform hides __v
    ctx.body = user.toObject();
  })
  .patch('/:userById', loadUserById, async function(ctx) {
    Object.assign(ctx.userById, pick(ctx.request.body, User.publicFields));
    await ctx.userById.save();

    ctx.body = ctx.userById.toObject();
  })
  .get('/:userById', loadUserById, async function(ctx) {
    ctx.body = ctx.userById.toObject();
  })
  .del('/:userById', loadUserById, async function(ctx) {
    await ctx.userById.remove();
    ctx.body = 'ok';
  })
  .get('/', async function(ctx) {
    let users = await User.find({}); // .lean(), but better do it on output

    ctx.body = users.map(user => user.toObject());
  });


app.use(router.routes());
