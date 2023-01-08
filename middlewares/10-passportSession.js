
import { default as passport } from 'koa-passport'
export function init(app) { return app.use(passport.session()) }
