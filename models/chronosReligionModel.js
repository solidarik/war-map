const mongoose = require('mongoose')

var chronosReligionSchema = new mongoose.Schema(
  {
    pageId: Number,
    startDate: {
      type: Date,
      required: 'Не задана начальная дата события',
    },
    endDate: Date,
    startDateStr: String,
    startYearInt: Number,
    endDateStr: String,
    endYearInt: Number,
    place: String,
    point: [],
    pageUrl: {
      type: String,
      unique: true,
      required: 'Не определена уникальная ссылка',
    },
    srcUrl: String,
    shortBrief: {
      type: String,
      required: 'Нет краткого описания события',
    },
    longBrief: {
      type: String,
      required: 'Нет полного описания события',
    },
    remark: String,
    priority: Number,
    comment: String,
  },
  {
    timestamps: false,
  }
)

chronosReligionSchema.statics.publicFields = ['place', 'startDate', 'endDate', 'isOnlyYear']

module.exports = mongoose.model('chronosReligion', chronosReligionSchema)
