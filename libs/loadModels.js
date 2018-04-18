const mongoose = require('./mongoose');

module.exports = async function (models) {

  let promises = [];
  for (let name in models) {
    let modelObjects = models[name];

    for (let modelObject of modelObjects) {
      promises.push(mongoose.model(name).create(modelObject));
    }
  }

  await Promise.all(promises);

};
