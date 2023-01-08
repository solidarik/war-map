
// request/response logger
import logger from 'koa-logger'
export function init(app) { return app.use(logger()) }
