const mongoose = require('mongoose');

var mapObjectSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: "Не задан уникальный идентификатор",
    unique: true,
  },
  kind: {
    type: String,
    required: "Не задан тип геометрии."
  },
  name: {
    type: String,
  },
  coords: {
    type:     Array,
    required: "Объект не может быть пустым.",
  },
  deleted: Boolean,
}, {
  timestamps: true
});


module.exports = mongoose.model('MapObject', mapObjectSchema);
