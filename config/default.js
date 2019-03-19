const defer = require("config/defer").deferConfig;
const path = require("path");

module.exports = {
  // secret data can be moved to env variables
  // or a separate config
  secret: "mysecret",
  port: process.env.PORT || 3000,
  redis_uri: process.env.REDISCLOUD_URL || "redis://localhost:6379",
  mongoose: {
    uri: process.env.MONGODB_URI || "mongodb://localhost/app",
    options: {
      keepAlive: 1,
      poolSize: 5,
      useNewUrlParser: true,
      useCreateIndex: true
    }
  },
  crypto: {
    hash: {
      length: 128,
      // may be slow(!): iterations = 12000 take ~60ms to generate strong password
      iterations: process.env.NODE_ENV == "production" ? 12000 : 12000
    }
  },
  template: {
    // template.root uses config.root
    root: defer(function(cfg) {
      return path.join(cfg.root, "templates");
    })
  },
  root: process.cwd()
};
