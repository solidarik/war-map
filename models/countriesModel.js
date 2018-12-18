const mongoose = require('mongoose');

var countriesModel = new mongoose.Schema({
    _country: {
        type: mongoose.Schema.ObjectId,
        required: "Не задано имя страны",
        unique: true
    },
    _capital: {
        type: mongoose.Schema.ObjectId,
        required: "Не задано имя столицы",
        unique: false
    },
    iso2: {
        type: String,
        required: "Не задан код ISO2",
        unique: true
    },
    iso3: {
        type: String,
        required: "Не задан код ISO3",
        unique: true
    },
    centroid: {
        type: Array,
        required: "Не задан центр страны"
    },
}, {
    timestamps: false
});

module.exports = mongoose.model('dict_countries', countriesModel);
