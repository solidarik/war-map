const Router = require('koa-router');
const router = new Router();

ensureAuthenticated = async function  (ctx, next) {

    if (ctx.isAuthenticated()) {
        return next()
    }

    ctx.session.returnTo = ctx.request.url
    ctx.body = ctx.render('login')
}

router.get('/login', require('./login').get)
router.post('/login', require('./login').post)
router.get('/start', ensureAuthenticated, require('./page-start'))
router.get('/info', ensureAuthenticated, require('./page-info'))
router.get('/', ensureAuthenticated, require('./page-events'))
router.get('/events', ensureAuthenticated, require('./page-events'))
router.get('/logout', require('./logout').get)


module.exports = router.routes()