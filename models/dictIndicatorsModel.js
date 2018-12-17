const mongoose = require('mongoose');
var dictIndicatorsSchema = new mongoose.Schema({
  code: {
    type: Number,
    required: "Не задан уникальный код",
    unique: true,
  },
  _name: mongoose.Schema.ObjectId,
  _unit: mongoose.Schema.ObjectId
}, {
  timestamps: true
});

dictIndicatorsSchema.virtual('full_name_rus').get( () => {
    return this.short_name_eng;
});

module.exports = mongoose.model('dict_indicators', dictIndicatorsSchema);
