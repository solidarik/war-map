const mongoose = require('mongoose')

var battlesSchema = new mongoose.Schema(
  {
    _name: mongoose.Schema.ObjectId,
    filename: String,
    startDate: {
      type: Date,
      required: 'Не задана начальная дата события',
    },
    endDate: Date,
    kind: String,
    point: [],
    pageId: Number,
    imgUrl: String,
    srcUrl: String,
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

module.exports = mongoose.model('battles', battlesSchema, 'battles')
