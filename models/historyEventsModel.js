const mongoose = require('mongoose');

var historyEventsSchema = new mongoose.Schema({
  _name: mongoose.Schema.ObjectId,
  startDate: {
    type: Date,
    required: "Не задана начальная дата события",
  },
  endDate: Date,
  kind: String,
  pageId: Number,
  imgUrl: String,
  enemies: [],
  allies: [],
  maps: [],
  corvexes: []
}, {
  timestamps: false
});

historyEventsSchema.statics.publicFields = ["startDate", "endDate"]

module.exports = mongoose.model('historyEvents', historyEventsSchema, 'historyEvents');
