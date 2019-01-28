const Router = require('koa-router');
const router = new Router();

ensureAuthenticated = async function  (ctx, next) {

    if (ctx.isAuthenticated()) {
        return next();
    }

    ctx.session.returnTo = ctx.request.url;
    ctx.body = ctx.render('login');
}

router

    .get('/login', require('./login').get)
    .post('/login', require('./login').post)

    .get('/logout', require('./logout').get)

    .get('/info', ensureAuthenticated, require('./page-info'))
    .get('/', ensureAuthenticated, require('./page-events'))
    .get('/events', ensureAuthenticated, require('./page-events'));

module.exports = router.routes();