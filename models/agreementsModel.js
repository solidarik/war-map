import mongoose from 'mongoose'

var agreementsSchema = new mongoose.Schema(
  {
    pageId: Number,
    loadStatus: String,
    isOnMap: Boolean,
    lineSource: Number,

    startDate: {
      type: Date,
      required: 'Не задана начальная дата события',
    },
    endDate: Date,
    startDateStr: String,
    endDateStr: String,

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

export default mongoose.model('agreements', agreementsSchema, 'agreements')
