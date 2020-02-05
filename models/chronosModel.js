const mongoose = require('mongoose')

var chronosSchema = new mongoose.Schema(
  {
    _name: mongoose.Schema.ObjectId,
    startDate: {
      type: Date,
      required: 'Не задана начальная дата события'
    },
    isOnlyYear: Boolean,
    endDate: Date,
    kind: String,
    place: String,
    placeCoords: [],
    url: String,
    brief: {
      type: String,
      required: 'Нет описания события'
    }
  },
  {
    timestamps: false
  }
)

chronosSchema.statics.publicFields = ['startDate', 'endDate', 'isOnlyYear']

module.exports = mongoose.model('chronos', chronosSchema)
