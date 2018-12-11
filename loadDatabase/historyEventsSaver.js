const HistoryEventsModel = require('../models/HistoryEventsModel');
const DictEngRusModel = require('../models/DictEngRusModel');
const fileHelper = require('../helper/fileHelper');
const log = require('../helper/logHelper');
const chalk = require('chalk');
const http = require('http');
const moment = require('moment');

saveFilesFromDir({
    sourceDir: 'war-map\samara\improvedMaps',
    mediator: historyEventsJsonMediator,
    model: historyEventModel,
    equilFields: ['start_date', 'name']});

class HistoryEventsSaver {

    async getPlacesFromJson(json) {
        let places = [];
        for (let i = 0; i < json.length; i++) {
            let place = {};
            let obj = json[i];
            place.coordinates = geoHelper.fromLonLat(obj.lonlat_coordinates);
            place.name = await this.getEngRusObjectId(obj.name);
            places.push(place);
        };
        return(places);
    }

    async getAlliesFromJson(json) {
        let allies = [];
        for (let i = 0; i < json.length; i++) {
            let ally = {};
            let obj = json[i];
            ally.name = await this.getEngRusObjectId(obj.name);
            ally.troops = obj.troops;
            ally.losses = obj.losses;
            ally.winner = obj.hasOwnProperty('winner') ? true : false;
            allies.push(ally);
        };
        return(allies);
    }

    saveHistoryEvents() {
        const dirPath = fileHelper.composePath('improvedMaps');
        let files = fileHelper.getFilesFromDir(dirPath);
        files.forEach( (filePath) => {
            let json = fileHelper.getJsonFromFile(filePath);
            (async() => {

                const _name_id = this.getEngRusObjectId(json.name);
                const places = this.getPlacesFromJson(json.places);
                const allies = this.getAlliesFromJson(json.allies);
                const enemies = this.getAlliesFromJson(json.enemies);

                const historyEvent = new HistoryEventsModel({
                    start_date: moment(json.start_date, 'DD.MM.YYYY'),
                    end_date: moment(json.end_date, 'DD.MM.YYYY'),
                    kind: json.kind,
                    _name: await _name_id,
                    page_id: json.page_id,
                    img_url: json.img_url,
                    places: await places,
                    allies: await allies,
                    enemies: await enemies,
                    features: json.features,
                });

                let res = await historyEvent.save();
                return res;
            })();
        });
    }
}

module.exports = DbHelper;