import passport from '../libs/passport/index.js'
export function init(app) { return app.use(passport.initialize()) }
