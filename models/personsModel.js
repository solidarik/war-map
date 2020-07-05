const mongoose = require('mongoose')

var personsSchema = new mongoose.Schema(
  {
    pageId: Number,
    surname: String,
    name: String,
    middlename: String,
    dateBirth: {
      type: Date,
      required: 'Не задана начальная дата события',
    },
    dateBirthStr: String,
    dateDeath: Date,
    dateDeathStr: String,
    dateAchievement: Date,
    dateAchievementStr: String,
    description: String,
    fullDescription: String,
    pageUrl: {
      type: String,
      unique: true,
      required: 'Не определена уникальная ссылка',
    },
    srcUrl: String,
    photoUrl: String,
    linkUrl: String,
    placeAchievement: String,
    placeAchievementCoords: [],
    placeBirth: String,
    placeBirthCoords: [],
    placeDeath: String,
    placeDeathCoords: [],
  },
  {
    timestamps: false,
  }
)

personsSchema.statics.publicFields = ['surname', 'name', 'middlename']

module.exports = mongoose.model('persons', personsSchema)
