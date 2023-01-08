import mongoose from 'mongoose'

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

dictIndicatorsSchema.virtual('fullNameRus').get( () => {
    return this.short_name_eng;
});

export default mongoose.model('dictIndicators', dictIndicatorsSchema, 'dictIndicators');
