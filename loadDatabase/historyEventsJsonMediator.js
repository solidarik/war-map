const HistoryEventsModel = require('../models/historyEventsModel');
const dictEngRusProtocol = require('../socketProtocol/dictEngRusProtocol');
const geoHelper = require('../helper/geoHelper');
const inetHelper = require('../helper/inetHelper');
const SuperJsonMediator = require('./superJsonMediator');
const moment = require('moment');

class HistoryEventsJsonMediator extends SuperJsonMediator {

    constructor() {
        super();
        this.equilFields = ['startDate', '_name'];
        this.model = HistoryEventsModel;
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

                dictEngRusProtocol.getEngRusObject(json.name)
                .then( obj => { return inetHelper.getWikiPageId([obj.eng, obj.rus])}),

                this.getPlacesFromJson(json.places),
                this.getAlliesFromJson(json.allies),
                this.getAlliesFromJson(json.enemies),
            ];

            Promise.all(promises)
            .then(
                res => {
                    let [name_id, page_id, places, allies, enemies] = res;

                    const newJson = {
                        _name: name_id,
                        startDate: moment(json.startDate, 'DD.MM.YYYY'),
                        endDate: moment(json.endDate, 'DD.MM.YYYY'),
                        kind: json.kind,
                        page_id: pageId,
                        img_url: json.imgUrl,
                        places: places,
                        allies: allies,
                        enemies: enemies,
                        features: json.features,
                    };
                    resolve(newJson);
                },
                err => { reject(`Ошибка в processJson: ${err}`);
            })
            .catch( err => { throw err; } );
        });
    }
}

module.exports = new HistoryEventsJsonMediator();