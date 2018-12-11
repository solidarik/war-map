const DictSourcesModel = require('../models/DictSourcesModel');
const DictIndicatorsModel = require('../models/DictIndicatorsModel');
const DictEngRusModel = require('../models/DictEngRusModel');
const HistoryEventsModel = require('../models/HistoryEventsModel');
const log = require('../helper/logHelper');
const fileHelper = require('../helper/fileHelper');
const geoHelper = require('../helper/geoHelper');
const mongoose = require('mongoose');
const config = require('config');
const chalk = require('chalk');
const http = require('http');
const moment = require('moment');

class DbHelper {

    getLocalDb() {
        if (process.env.MONGOOSE_DEBUG) {
            mongoose.set('debug', true);
        }

        mongoose.Promise = global.Promise;
        mongoose.connect(config.mongoose.uri, config.mongoose.options);
        return mongoose;
    }

    constructor(db) {
        this.isOuter = (db == undefined);
        this.db = db ? db : this.getLocalDb();
    }

    async getEngRusObject(name) {
        let isRus = /[а-яА-ЯЁё]/.test(name);
        let doc = await DictEngRusModel.findOne( (isRus) ? {rus: name} : {eng: name});
        return (doc && typeof doc !== 'undefined') ? doc : undefined;
    }

    async getEngRusObjectId(name) {
        let isRus = /[а-яА-ЯЁё]/.test(name);
        let doc = await DictEngRusModel.findOne( (isRus) ? {rus: name} : {eng: name});
        return (doc && typeof doc !== 'undefined') ? doc['_id'].toString() : undefined;
    }

    async addEngRus(eng, rus) {

        var id = await this.getEngRusObjectId(eng);
        if (id) return(id);

        const engRus = new DictEngRusModel({eng: eng, rus: rus});
        let res = await engRus.save();

        id = await this.getEngRusObjectId(eng);
        return (id ? id : undefined);
    }

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

    fillEngRus() {
        const engRusFilePath = fileHelper.composePath('engRus.json');
        let obj = fileHelper.getJsonFromFile(engRusFilePath);
        obj.forEach( (item, i, arr) => {
            dbHelper.addEngRus(item[0], item[1]);
        });
        return;
    }

    fillDictCountries() {
        const filePath = fileHelper.composePath('samara', 'data', 'countries_centroid.json');
        let obj = fileHelper.getJsonFromFile(filePath);
        obj.forEach( (item, i, arr) => {
            if (i == 0) {
                info(fromLonLat([56.004 , 54.6950]));
                let country = {
                    iso: item['ISO3'],
                    eng: item['NAME'],
                    region: item['REGION'],
                    subregion: item['SUBREGION']
                };
                info('iso: ' + item['ISO3']);
                info(JSON.stringify(item));
            }
        });
        info(obj.length);
    }

    getSamaraSource() {
        const firstSource = new DictSourcesModel({
            source_code: 'samara_json',
            source_name_rus: 'Данные, предоставленные коллегами из Самары',
            source_name_eng: 'Data from Samara colleagues'
        });

        let query = DictSourcesModel.findOne({source_code: firstSource.source_code});
        query.then( (doc) => {

            console.log(doc['_id']);

            if (!doc) {
                firstSource.save((err) => {
                    if (!err) success('object created');
                    else error('object did not create', err);
                });
            }

        });

    }

    free() {
        if (isOuter) return;
        setTimeout( () => { this.db.disconnect(); info(chalk.yellow('db disconnected')); }, 100);
    }
}

module.exports = DbHelper;