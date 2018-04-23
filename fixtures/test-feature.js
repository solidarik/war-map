/**
 * This file must be required at least ONCE.
 * After it's done, one can use require('mongoose')
 *
 * In web-app: ctx is done at init phase
 * In tests: in mocha.opts
 * In gulpfile: in beginning
 */

const mongoose = require('../libs/mongoose');
var featureSchema = new mongoose.Schema({
  kind: {
    type:     String,
    //required: "Не задан тип геометрии."
  },
  coords: {
    type:     String,
    //required: "Объект не может быть пустым.",
  },
  deleted: Boolean,
}, {
  timestamps: true
});

const Feature = mongoose.model('Feature', featureSchema);
let feature = new Feature({kind: 'Point', coords: [1, 2]});
feature.save((err) => {
    if (!err)
        console.log("success");
    console.log(JSON.stringify(feature));
});