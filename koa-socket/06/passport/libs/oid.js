// generate a valid object id from an arbitrary string

const crypto = require('crypto');

// oid('course1') => generates always same id
module.exports = function oid(str) {
  return crypto.createHash('md5').update(str).digest('hex').substring(0, 24);
};

exports.withTime = oidWithTime;

function oidWithTime(str) {
  const time = Math.floor(Date.now() / 1000).toString(16);
  while (time.length < 8) { // never happens in real-life though
    time = '0' + time;
  }
  return time + crypto.createHash('md5').update(str).digest('hex').substring(0, 16);
}
