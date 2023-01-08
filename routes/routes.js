import Router from 'koa-router'
const router = new Router()
import config from 'config'
import personsModel from '../models/personsModel.js'

const ensureAuthenticated = async function(ctx, next) {
  if (ctx.isAuthenticated()) {
    return next()
  }

  ctx.session.returnTo = ctx.request.url
  ctx.body = ctx.render('login.js')
}

// router.get('/login', (await import('./login.js')).get)
// router.post('/login', (await import('./login.js')).post)
//router.get('/index', ensureAuthenticated, (await import('./page-index.js')).default)
// router.get('/logout', (await import('./logout.js')).get)

router.get('/', (await import('./page-events.js')).default)
router.get('/index', (await import('./page-index.js')).default)
router.get('/about', (await import('./page-about.js')).default)
router.get('/task', (await import('./page-task.js')).default)
router.get('/video', (await import('./page-video.js')).default)
router.get('/info', (await import('./page-info.js')).default)
router.get('/events', (await import('./page-events.js')).default)
router.get('/armament', (await import('./page-armament.js')).default)
router.get('/ships', (await import('./page-ships.js')).default)
router.get('/aircrafts', (await import('./page-aircrafts.js')).default)
router.get('/tanks', (await import('./page-tanks.js')).default)

// router.get('/person', (await import('./page-person.js')).default)

const getPersons = async function (ctx, next) {
  // persons = await redisClient.get('persons')
  // if (!persons) return

  //! persons только с набором необходимых полей
  const personsSelectParam = {'name': 1, 'surname': 1, 'middlename': 1, 'activity': 1, 'pageUrl': 1}
  const persons = await personsModel.find({}).select(personsSelectParam)

  // получение полного набора полей (долго по времени)
  //const persons = await personsModel.find({})

  //ctx.state = {'persons': JSON.parse(persons)}
  ctx.state = { 'persons': persons }
  next()
}

const getPerson = async function (ctx, next) {

  const person = await personsModel.find({ 'pageUrl': ctx.params.name })
  if (!person) return

  // persons = await redisClient.get('persons')
  // if (!persons) return

  // const persons = await personsModel.find({})

  ctx.state = { 'person': person[0], 'persons': [] }
  next()
}

router.get('/person', getPersons, (await import('./page-person.js')).default)
router.get('/person/:name', getPerson, (await import('./page-person.js')).default)


export default router.routes()
