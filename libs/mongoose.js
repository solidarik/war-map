const mongoose = require('mongoose');
const config = require('config');

if (process.env.MONGOOSE_DEBUG) {
    mongoose.set('debug', true);
}

mongoose.set('useFindAndModify', false);

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoose.uri, config.mongoose.options);

module.exports = mongoose;
