
// Parse application/json, application/x-www-form-urlencoded
// NOT form/multipart!
import bodyParser from 'koa-bodyparser'
export function init(app) { return app.use(bodyParser()) }
