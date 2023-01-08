// Usually served by Nginx
import serve from 'koa-static'

export function init(app) {
    return app.use(serve('public'))
}
