const mongoose = require('mongoose')

var personSchema = new mongoose.Schema(
  {
    _personId: mongoose.Schema.ObjectId,
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

personSchema.statics.publicFields = ['startDate', 'endDate', 'isOnlyYear']

module.exports = mongoose.model('person', personSchema, 'person')
