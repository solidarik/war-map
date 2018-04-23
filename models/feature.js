const mongoose = require('mongoose');

var featureSchema = new mongoose.Schema({
  kind: {
    type:     String,
    required: "Не задан тип геометрии."
  },
  coords: {
    type:     Array,
    required: "Объект не может быть пустым.",
  },
  deleted: Boolean,
}, {
  timestamps: true
});


module.exports = mongoose.model('Feature', featureSchema);
