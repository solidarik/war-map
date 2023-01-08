// long stack trace (+clarify from co) if needed
if (process.env.TRACE) {
  import('./libs/trace.js')
}

import Koa from 'koa'

const app = new Koa()
import KoaRange from 'koa-range'
app.use(KoaRange)

import config from 'config'
import mongoose from './libs/mongoose.js'

// keys for in-koa KeyGrip cookie signing (used in session, maybe other modules)
app.keys = [config.secret]
app.mongoose = mongoose

import path from 'path'
import fs from 'fs'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const middlewares = fs.readdirSync(path.join(__dirname, 'middlewares')).sort()

const forEachPromise = new Promise(async resolve => {
  for (let i = 0; i < middlewares.length; i++) {
    const handlerName = middlewares[i]
    const middleware = await import(`./middlewares/${handlerName}`)
    middleware.init(app)
  }

  app.use((await import('./routes/routes.js')).default)

  const server = app.listen(config.port)

  let protocolFunctions = []
  const protocolClasses = fs
    .readdirSync(path.join(__dirname, 'socketProtocol'))
    .sort()
  for (let i = 0; i < protocolClasses.length; i++) {
    const handlerName = protocolClasses[i]
    const protocol = (await import(`./socketProtocol/${handlerName}`)).default
    protocolFunctions.push(protocol.getProtocol(app))
  }

  const serverSocket = (await import('./libs/serverSocket.js')).default
  app.socket = serverSocket(server, protocolFunctions)

  resolve(true)
})

forEachPromise.then()