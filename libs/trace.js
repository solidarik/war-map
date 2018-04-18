
Error.stackTraceLimit = 1000;
require('trace');
require('clarify');

const chain = require('stack-chain');

chain.filter.attach(function (error, frames) {
  return frames.filter(function (callSite) {
    const name = callSite && callSite.getFileName();
    return (name && name.indexOf("/co/") == -1);
  });
});
