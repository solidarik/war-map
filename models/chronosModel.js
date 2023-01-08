import mongoose from 'mongoose'

var chronosSchema = new mongoose.Schema(
  {
    pageId: Number,
    loadStatus: String,
    isOnMap: Boolean,
    lineSource: Number,

    start: {
      year: Number,
      month: Number,
      day: Number,
      dateStr: String,
      isOnlyYear: Boolean,
      isOnlyCentury: Boolean,
      century: Number
    },
    end: {
      year: Number,
      month: Number,
      day: Number,
      dateStr: String,
      isOnlyYear: Boolean,
      isOnlyCentury: Boolean,
      century: Number
    },
    place: String,
    point: [],
    pageUrl: {
      type: String,
      unique: true,
      required: 'Не определена уникальная ссылка',
    },
    srcUrl: String,
    brief: {
      type: String,
      required: 'Нет описания события',
    },
    remark: String,
    priority: Number,
    comment: String,
  },
  {
    timestamps: false,
  }
)

chronosSchema.statics.publicFields = ['startDate', 'endDate', 'isOnlyYear']

export default mongoose.model('chronos', chronosSchema)
