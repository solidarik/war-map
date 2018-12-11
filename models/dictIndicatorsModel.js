const mongoose = require('mongoose');
var dictIndicatorsSchema = new mongoose.Schema({
  code: {
    type: Number,
    required: "Не задан уникальный код",
    unique: true,
  },
  short_name_rus: {
    type: String,
    required: "Не задано краткое название индикатора (рус.)"
  },
  short_name_eng: {
    type: String,
    required: "Не задано краткое название индикатора (англ.)"
  },
  type_rus: {
    type: String,
    required: "Не задан тип индикатора (рус.)"
  },
  type_eng: {
    type: String,
    required: "Не задан тип индикатора (англ.)"
  },
  unit_rus: {
      type: String,
      required: "Не задана единица измерения (рус.)"
  },
  unit_eng: {
    type: String,
    required: "Не задана единица измерения (англ.)"
  },
  source: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Indicators'
  }
}, {
  timestamps: true
});

dictIndicatorsSchema.virtual('full_name_rus').get( () => {
    return this.short_name_eng;
});

module.exports = mongoose.model('dict_indicators', dictIndicatorsSchema);
