const socket = require('../libs/socket');

exports.post = async function(ctx, next) {

  if (ctx.session.socketIds) {
    ctx.session.socketIds.forEach(function(socketId) {
      console.log("emit to", socketId);
      socket.emitter.to(socketId).emit('logout');
    });
  }

  ctx.logout();

  ctx.session = null; // destroy session (!!!)

  ctx.redirect('/');
};
