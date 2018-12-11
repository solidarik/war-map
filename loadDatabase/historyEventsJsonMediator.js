const HistoryEventsModel = require('../models/HistoryEventsModel');
const dictEngRusProtocol = require('../socketProtocol/DictEngRusProtocol');
const moment = require('moment');

class HistoryEventsJsonMediator {

    constructor() {
        this.equilFields = ['start_date', 'name'];
    }

    getPlacesFromJson(json) {
        return new Promise( (resolve, reject) => {

            let promicesName = json.map( item => dictEngRusProtocol.getEngRusObjectId(item.name) );
            Promise.all(promicesName).then(
                objNames => { return objNames; }
            ).then(
                objNames => {
                    let places = [];
                    for (let i = 0; i < json.length; i++) {
                        let place = {};
                        let obj = json[i];
                        place.coordinates = geoHelper.fromLonLat(obj.lonlat_coordinates);
                        place.name = objNames[i];
                        places.push(place);
                    };
                    resolve(places);
                },
                err => { reject (`Ошибка в getPlacesFromJson: ${err}`)}
            );
        });
    }

    getAlliesFromJson(json) {
        return new Promise( (resolve, reject) => {
            let allies = [];
            let promicesName = json.map( item => dictEngRusProtocol.getEngRusObjectId(item.name) );

            Promise.all(promicesName).then(
                allyNames => { return allyNames; }
            ).then(
                allyNames => {
                    for(let i = 0; i < json.length; i++) {
                        let ally = {};
                        let obj = json[i];
                        ally.name = allyNames[i];
                        ally.troops = obj.troops;
                        ally.losses = obj.losses;
                        ally.winner = obj.hasOwnProperty('winner') ? true : false;
                        allies.push(ally);
                    };
                    resolve(allies);
                },
                err => { reject(`Ошибка в getAlliesFromJson: ${err}`);
            });
        });
    }

    processJson(json) {
        return new Promise( (resolve, reject) => {

            let promises = [
                dictEngRusProtocol.getEngRusObjectId(json.name),
                this.getPlacesFromJson(json.places),
                this.getAlliesFromJson(json.allies),
                this.getAlliesFromJson(json.enemies)
            ];

            Promise.all(promises)
            .then(
                res => {
                    let name_id, places, allies, enemies = res;

                    const newJson = {
                        start_date: moment(json.start_date, 'DD.MM.YYYY'),
                        end_date: moment(json.end_date, 'DD.MM.YYYY'),
                        kind: json.kind,
                        _name: name_id,
                        page_id: json.page_id,
                        img_url: json.img_url,
                        places: places,
                        allies: allies,
                        enemies: enemies,
                        features: json.features,
                    };
                    resolve(newJson);
                },
                err => { reject(`Ошибка в processJson: ${err}`);
            });
        });
    }

    addObjectToBase(json) {
        return new Promise( (resolve, reject) => {
        }
    }

    isExistObject(json) {
        return new Promise( (resolve, reject) => {
            let findJson = {};
            this.equilFields.forEach(element => {
                findJson[element] = json[element];
            });

            HistoryEventsModel.findOne(findJson, (err, res) => {

                if (err) {
                    reject(`Ошибка в isExistObject: не удалось найти объект ${err}`);
                }

                resolve(err && !res);
            });
        });
    }
}

module.exports = new HistoryEventsJsonMediator();