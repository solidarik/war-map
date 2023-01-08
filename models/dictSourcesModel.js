import mongoose from 'mongoose'

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

export default mongoose.model('dictSources', dictSourcesSchema, 'dictSources');
