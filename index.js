// long stack trace (+clarify from co) if needed
if (process.env.TRACE) {
  require('./libs/trace')
}

const Koa = require('koa')

const app = new Koa()
app.use(require('koa-range'))

const config = require('config')
const mongoose = require('./libs/mongoose')

// keys for in-koa KeyGrip cookie signing (used in session, maybe other modules)
app.keys = [config.secret]
app.mongoose = mongoose

const path = require('path')
const fs = require('fs')

const middlewares = fs.readdirSync(path.join(__dirname, 'middlewares')).sort()
middlewares.forEach(handler => require('./middlewares/' + handler).init(app))

/*
middlewares.forEach(function(middleware) {
  app.use(require('./middlewares/' + middleware));
});*/

app.use(require('./routes/routes.js'))

const serverSocket = require('./libs/serverSocket')

const server = app.listen(config.port)

let protocolFunctions = []
const protocolClasses = fs
  .readdirSync(path.join(__dirname, 'socketProtocol'))
  .sort()
protocolClasses.forEach(handler => {
  let protocolClass = require('./socketProtocol/' + handler)
  protocolClass.init()
  protocolFunctions.push(protocolClass.getProtocol(app))
})

app.socket = serverSocket(server, protocolFunctions)

var cron = require('cron');
var lp = require('./loadDatabase/loadPersons.js');
//0 */3 * * * * every 3 minutes
//0 0 */8 * * * every 8 hours
var cronJob = cron.job("0 0 */8 * * *", function(){
    // perform operation e.g. GET request http.get() etc.
    lp.download("http://www.historian.by/ww2/person.xlsx","./public/data/persons.xlsx",lp.parseExcel);
    console.info('cron job completed');
}); 
cronJob.start();