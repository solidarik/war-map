const mongoose = require('mongoose');
var dictSourcesSchema = new mongoose.Schema({
  source_code: {
    type: String,
    required: "Не задан уникальный код",
    unique: true,
  },
  _source_name: mongoose.Schema.ObjectId,
  aliases: []
}, {
  timestamps: false
});

module.exports = mongoose.model('dict_sources', dictSourcesSchema);
