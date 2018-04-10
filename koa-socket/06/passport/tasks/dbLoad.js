const fs = require('fs');
const co = require('co');
const path = require('path');
const root = require('config').root;
const mongoose = require('../libs/mongoose');
const loadModels = require('../libs/loadModels');
const clearDatabase = require('../libs/clearDatabase');

module.exports = async function() {

  const args = require('yargs')
    .usage("gulp db:load --from fixture/init")
    .demand(['from'])
    .describe('from', 'file to import')
    .argv;

  const dbPath = path.join(root, args.from);

  console.log("loading db " + dbPath);

  await clearDatabase();
  await loadModels(require(dbPath));

  console.log("loaded db " + dbPath);

  mongoose.disconnect();

};
