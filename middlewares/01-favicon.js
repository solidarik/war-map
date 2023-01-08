
// Usually served by Nginx
import favicon from 'koa-favicon'
export function init(app) { return app.use(favicon()) }

