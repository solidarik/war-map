
Error.stackTraceLimit = 1000;
require('trace');
require('clarify');

const chain = require('stack-chain');

chain.filter.attach(async function (error, frames) {
  return frames.filter(async function (callSite) {
    const name = callSite && callSite.getFileName();
    return (name && name.indexOf("/co/") == -1);
  });
});
