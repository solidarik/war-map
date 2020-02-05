const mongoose = require('mongoose')

var personsSchema = new mongoose.Schema(
  {
    _personId: mongoose.Schema.ObjectId,
    surname: String,
    name: String,
    middlename: String,
    dateBirth: {
      type: Date,
      required: 'Не задана начальная дата события'
    },
    dateDeath: Date,
    description: String,
    fullDescription: String,
    srcUrl: String,
    photoUrl: String,
    linkUrl: String,
    placeAchievement: String,
    placeAchievementCoords: [],
    placeBirth: String,
    placeBirthCoords: [],
    placeDeath: String,
    placeDeathCoords: []
  },
  {
    timestamps: false
  }
)

personsSchema.statics.publicFields = ['surname', 'name', 'middlename']

module.exports = mongoose.model('persons', personsSchema)
