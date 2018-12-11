const mongoose = require('mongoose');

var historyEventsModel = new mongoose.Schema({
  start_date: {
    type: Date,
    required: "Не задана начальная дата события",
  },
  end_date: Date,
  kind: String,
  _name: mongoose.Schema.ObjectId,
  page_id: Number,
  img_url: String,
  places: [],
  enemies: [],
  allies: [],
  features: [],
}, {
  timestamps: false
});

module.exports = mongoose.model('history_events', historyEventsModel);
