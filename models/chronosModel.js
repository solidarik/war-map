const mongoose = require('mongoose')

var chronosSchema = new mongoose.Schema(
  {
    pageId: Number,
    startDate: {
      type: Date,
      required: 'Не задана начальная дата события',
    },
    startDateStr: String,
    isOnlyYear: Boolean,
    endDate: Date,
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

module.exports = mongoose.model('chronos', chronosSchema)
