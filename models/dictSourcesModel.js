const mongoose = require('mongoose');
var dictSourcesSchema = new mongoose.Schema({
  source_code: {
    type: String,
    required: "Не задан уникальный код",
    unique: true,
  },
  source_name_rus: {
    type: String,
    required: "Не задано краткое название источника (рус.)"
  },
  source_name_eng: {
    type: String,
    required: "Не задано краткое название источника (англ.)"
  }
}, {
  timestamps: false
});

module.exports = mongoose.model('dict_sources', dictSourcesSchema);
