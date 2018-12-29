const mongoose = require('mongoose');

var historyEventsSchema = new mongoose.Schema({
  startDate: {
    type: Date,
    required: "Не задана начальная дата события",
  },
  endDate: Date,
  kind: String,
  _name: mongoose.Schema.ObjectId,
  pageId: Number,
  imgUrl: String,
  enemies: [],
  allies: [],
  features: [],
}, {
  timestamps: false
});

historyEventsSchema.statics.publicFields = ["startDate", "endDate"]

module.exports = mongoose.model('history_events', historyEventsSchema);
