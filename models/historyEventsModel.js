const mongoose = require('mongoose')

var historyEventsSchema = new mongoose.Schema(
  {
    _name: mongoose.Schema.ObjectId,
    filename: String,
    startDate: {
      type: Date,
      required: 'Не задана начальная дата события'
    },
    endDate: Date,
    kind: String,
    pageId: Number,
    imgUrl: String,
    enemies: [],
    allies: [],
    winner: String,
    maps: [],
    corvexes: []
  },
  {
    timestamps: false
  }
)

historyEventsSchema.statics.publicFields = ['startDate', 'endDate']

module.exports = mongoose.model(
  'historyEvents',
  historyEventsSchema,
  'historyEvents'
)
