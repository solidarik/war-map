const mongoose = require('mongoose')

var agreementsSchema = new mongoose.Schema(
  {
    pageId: Number,
    startDate: {
      type: Date,
      required: 'Не задана начальная дата события',
    },
    endDate: Date,
    kind: String,
    place: String,
    point: [],
    pageUrl: {
      type: String,
      unique: true,
      required: 'Не определена уникальная ссылка',
    },
    imgUrl: String,
    player1: String,
    player2: String,
    results: String,
    srcUrl: String,
  },
  {
    timestamps: false,
  }
)

agreementsSchema.statics.publicFields = ['startDate', 'endDate']

module.exports = mongoose.model('agreements', agreementsSchema, 'agreements')
