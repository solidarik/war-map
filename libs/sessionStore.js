const mongooseStore = require('koa-session-mongoose');

module.exports = mongooseStore.create({
  model:   'Session',
  expires: 3600 * 4
});
