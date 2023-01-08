let Cookies = require('cookies');
let config = require('config');
let mongoose = require('mongoose');
let co = require('co');
let User = require('../models/usersModel');

let socketIO = require('socket.io');

let socketRedis = require('socket.io-redis');

let sessionStore = require('./sessionStore');

function socket(server) {

  let io = socketIO(server);
  io.adapter(socketRedis(config.redis_uri));

  io.use(function(socket, next) { // req
    let handshakeData = socket.request;

    let cookies = new Cookies(handshakeData, {}, config.keys);

    let sid = 'koa:sess:' + cookies.get('sid');

    co(function* () {

      let session = yield* sessionStore.get(sid, true);

      console.log(session);

      if (!session) {
        throw new Error("No session");
      }

      if (!session.passport && !session.passport.user) {
        throw new Error("Anonymous session not allowed");
      }

      // if needed: check if the user is allowed to join
      socket.user = yield User.findById(session.passport.user);

      // if needed later: refresh socket.session on events
      socket.session = session;

      // on restarts may be junk sockedIds
      // no problem in them
      session.socketIds = session.socketIds ? session.socketIds.concat(socket.id) : [socket.id];

      console.log(session.socketIds);
      yield sessionStore.save(sid, session);

      socket.on('disconnect', function() {
        co(function* clearSocketId() {
          let session = yield* sessionStore.get(sid, true);
          if (session) {
            session.socketIds.splice(session.socketIds.indexOf(socket.id), 1);
            yield* sessionStore.save(sid, session);
          }
        }).catch(function(err) {
          console.error("session clear error", err);
        });
      });

    }).then(function() {
      next();
    }).catch(function(err) {
      console.error(err);
      next(new Error("Error has occured."));
    });

  });

  io.on('connection', function (socket) {
    // const t = setTimeout(() => socket.disconnect(), 5000);
    //
    // socket.on('auth', (login, password) => {
    //   if (true) {
    //     clearTimeout(t);
    //   } else {
    //     clearTimeout(t);
    //     socket.disconnect();
    //   }
    // })

    socket.emit('message', 'hello', function(response) {
      console.log("delivered", response);
    });

    // socket.on('', () => {...});

    socket.broadcast.emit('welcome', `user ${socket.user.displayName} connected!`);
  });
}


let socketEmitter = require('socket.io-emitter');

//let redisClient = require('redis').createClient(config.redis_uri, {no_ready_check: true});
let redisClient = require('redis').createClient(config.redis_uri, {no_ready_check: false});
socket.emitter = socketEmitter(redisClient);

module.exports = socket;
