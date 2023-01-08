import mongoose from 'mongoose'

var battlesSchema = new mongoose.Schema(
  {
    pageId: Number,
    loadStatus: String,
    isOnMap: Boolean,
    lineSource: Number,

    name: String,
    startDate: {
      type: Date,
      required: 'Не задана начальная дата события',
    },
    endDate: Date,
    kind: String,
    point: [],
    pageUrl: {
      type: String,
      unique: true,
      required: 'Не определена уникальная ссылка',
    },
    imgUrl: String,
    srcUrl: String,
    correction: String,
    comment: String,
    enemies: [],
    allies: [],
    winner: String,
    isWinnerUSSR: Boolean,
    isWinnerGermany: Boolean,
    maps: [],
    hullCoords: [],
    ally_troops: String,
    ally_tanks_cnt: String,
    ally_airplans_cnt: String,
    ally_ships_cnt: String,
    ally_submarines_cnt: String,
    ally_losses: String,
    ally_deads: String,
    ally_prisoners: String,
    ally_woundeds: String,
    ally_missing: String,
    ally_tanks_lost: String,
    ally_airplans_lost: String,
    ally_ships_lost: String,
    ally_submarines_lost: String,
    enem_troops: String,
    enem_tanks_cnt: String,
    enem_airplans_cnt: String,
    enem_ships_cnt: String,
    enem_submarines_cnt: String,
    enem_losses: String,
    enem_deads: String,
    enem_prisoners: String,
    enem_woundeds: String,
    enem_missing: String,
    enem_tanks_lost: String,
    enem_airplans_lost: String,
    enem_ships_lost: String,
    enem_submarines_lost: String,
  },
  {
    timestamps: false,
  }
)

battlesSchema.statics.publicFields = ['startDate', 'endDate']

export default mongoose.model('battles', battlesSchema, 'battles')
