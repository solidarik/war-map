const mongoose = require('mongoose');
var dictSourcesSchema = new mongoose.Schema({
  sourceCode: {
    type: String,
    required: "Не задан уникальный код",
    unique: true,
  },
  _sourceName: mongoose.Schema.ObjectId,
  aliases: []
}, {
  timestamps: false
});

module.exports = mongoose.model('dict_sources', dictSourcesSchema);
