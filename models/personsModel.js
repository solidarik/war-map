import mongoose from 'mongoose'

var personsSchema = new mongoose.Schema(
  {
    pageId: Number,
    loadStatus: String,
    isOnMap: Boolean,
    lineSource: Number,

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
    achievementYearStr: String,
    deathYearStr: String,
    description: String,
    fullDescription: String,
    pageUrl: {
      type: String,
      unique: true,
      required: 'Не определена уникальная ссылка',
    },
    srcUrl: String,
    photoFullUrl: String,
    photoShortUrl: String,
    linkUrls: [],
    placeAchievement: String,
    placeAchievementCoords: [],
    placeBirth: String,
    placeBirthCoords: [],
    placeDeath: String,
    placeDeathCoords: [],
    activity: String,
    isInvertor: Boolean
  },
  {
    timestamps: false,
  }
)

personsSchema.statics.publicFields = ['surname', 'name', 'middlename']

export default mongoose.model('persons', personsSchema)
